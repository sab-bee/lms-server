import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import nodemailer from "nodemailer";
import { query } from "express";

function getDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  // JavaScript months are zero-based, so we add 1 to get the correct month
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Adding leading zero if necessary
  const day = ("0" + currentDate.getDate()).slice(-2); // Adding leading zero if necessary

  // Construct the formatted date string in the desired format
  return `${year}-${month}-${day}`;
}

export const register = (req, res) => {
  const query1 = "select * from auth where student_id = ?";
  const query2 = "select * from auth where admin_id = ?";

  db.query(query1, req.body.id, (err, studentData) => {
    if (err) return res.json({ err });
    db.query(query2, req.body.id, (err, adminData) => {
      if (err) return res.json(err);

      if (studentData.length || adminData.length)
        return res.status(409).json({ message: "you already have an account" });

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      let q = "";

      db.query(
        "select * from student where student_id = ?",
        req.body.id,
        (err, sdata) => {
          if (err) return res.json({ err });
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
            if (err) return res.status(404).json(err);
            return res.status(200).json({ ...data, message: "registered" });
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
        return res.status(404).json({ message: "you don't have any account" });

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
        // .cookie("access_token", token, {
        //   httpOnly: true,
        // })
        .status(200)
        .json({ ...other, access_token: token });
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

export const verifyEmail = (req, res) => {
  const query = "select email from auth where email = ?";
  db.query(query, req.body.email, (err, data) => {
    if (err) return res.json(err);
    if (data.length) {
      function generateRandomCode() {
        const code = Math.floor(Math.random() * 900000) + 100000;
        return code.toString();
      }

      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "support@fleyan.com",
          pass: process.env.MAIL_PASS,
        },
      });

      async function main() {
        // send mail with defined transport object
        const code = generateRandomCode();
        // const info = await transporter.sendMail({
        //   from: '"LMS support 👻" <support@fleyan.com>', // sender address
        //   to: req.body.email, // list of receivers
        //   subject: "Email Verification", // Subject line
        //   html: `<h1>${code}</h1>`, // plain text body
        // });

        const query = `UPDATE auth SET otp = ? WHERE email = ?`;

        db.query(query, [code, req.body.email], (err, data) => {
          if (err) {
            console.log(err);
          } else {
            setTimeout(() => {
              db.query(query, [null, req.body.email], (err, data) => {
                if (err) {
                  console.log(err);
                }
              });
            }, 60000);
          }
        });

        // console.log("Message sent: %s", info.messageId);
        return res.status(200).json({ message: true });
      }

      main().catch(console.error);
    } else {
      return res.status(404).json({ message: "incorrect email address" });
    }
  });
};

export const otpCheck = (req, res) => {
  const query = `select otp from auth where email = ? `;
  db.query(query, req.body.email, (err, data) => {
    if (err) return res.status(400).json(err);
    if (data.length) {
      if (data[0].otp === req.body.otp) {
        return res.status(200).json({ message: true });
      }
      return res.status(400).json({ message: "incorrect otp" });
    }
  });
};

export const setPass = (req, res) => {
  const query = `UPDATE auth SET password = ? WHERE email = ?`;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  db.query(query, [hash, req.body.email], (err, data) => {
    if (err) return res.status(400).json(err);
    return res.status(200).json(data);
  });
};
