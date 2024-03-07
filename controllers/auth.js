import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

function getDate() {
  // Create a new Date object to get the current date
  const currentDate = new Date();

  // Get the current year, month, and day
  const year = currentDate.getFullYear();
  // JavaScript months are zero-based, so we add 1 to get the correct month
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Adding leading zero if necessary
  const day = ("0" + currentDate.getDate()).slice(-2); // Adding leading zero if necessary

  // Construct the formatted date string in the desired format
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export const register = (req, res) => {
  const query1 = "select * from auth where student_id = ?";
  const query2 = "select * from auth where admin_id = ?";

  db.query(query1, req.body.id, (err, studentData) => {
    if (err) return res.json(err);
    db.query(query2, req.body.id, (err, adminData) => {
      if (err) return res.json(err);

      if (studentData.length || adminData.length)
        return res.status(409).json("user already exist");

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      let q = "";

      db.query(
        "select * from student where student_id = ?",
        req.body.id,
        (err, sdata) => {
          if (err) return res.json(err);
          if (sdata.length) {
            q =
              "insert into auth(`student_id`, `user_name`, `email`, `password`, `account_type`, `join_date`) values(?)";
          } else {
            q =
              "insert into auth(`admin_id`, `user_name`, `email`, `password`, `account_type`, `join_date`) values(?)";
          }

          const values = [
            req.body.id,
            req.body.name,
            req.body.email,
            hash,
            "free",
            getDate(),
          ];

          db.query(q, [values], (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json(data);
          });
        }
      );
    });
  });
};

export const login = (req, res) => {
  const query1 = "select * from auth where student_id = ?";
  const query2 = "select * from auth where admin_id = ?";

  db.query(query1, req.body.user_id, (err, studentData) => {
    if (err) return res.json(err);

    db.query(query2, req.body.user_id, (err, adminData) => {
      if (err) return res.json(err);
      const data = studentData.length ? studentData : adminData;
      if (data.length === 0)
        return res.status(404).json({ messasge: "user not found" });

      // check pass if user exist
      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        data[0].password
      );

      // if password wrong thorw error
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "wrong username or password" });

      // generate jwt token
      const token = jwt.sign(
        { user_id: data[0].student_id || data[0].admin_id },
        process.env.SECRET_KEY
      );

      // extract password from full information
      const { password, ...other } = data[0];

      // send information except the hashed password as coockie
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(other);
    });
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json({ message: "user logged out" });
};
