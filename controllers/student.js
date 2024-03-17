import { db } from "../db.js";

/**
 * add student to the STUDENT TABLE
 * @Action_BY - ADMIN
 */
export const add = (req, res) => {
  const query = "insert into student(`student_id`) values(?)";
  db.query(query, req.body.student_id, (err, data) => {
    if (err) return res.status(400).json(err);
    return res.status(200).json({ ...data, message: "user added" });
  });
};

export const remove = (req, res) => {};
