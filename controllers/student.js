import { db } from "../db.js";

export const add = (req, res) => {
  const scheema = "insert into student(`student_id`) values(?)";
  db.query(scheema, req.body.student_id, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json({ message: "user added" });
  });
};

export const remove = (req, res) => {};
