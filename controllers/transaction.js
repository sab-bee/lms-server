import { db } from "../db.js";
import { v4 as uuid } from "uuid";

/**
 * user can request for a book
 * @ACTION_BY - USER
 */
export const request = (req, res) => {
  const query =
    "insert into transaction(`transaction_id`,`student_id`,`book_id`,`status`, `share`) values(?)";

  const { student_id, book_id } = req.body;
  const values = [uuid(), student_id, book_id, "pending", 0];
  db.query(query, [values], (err, data) => {
    if (err) return res.status(400).json(err);
    return res.status(200).json({ ...data, message: "requested" });
  });
};

/**
 * action after user request for a book
 * @ACTION_BY - ADMIN
 */
export const action = (req, res) => {
  const query = "update transaction set status = ? where book_id = ?";
  const params = [req.body.approve ? "approved" : "denied", req.body.book_id];

  db.query(query, params, (err, data) => {
    if (err) return res.status(400).json(err);
    return res.json(data);
  });
};
