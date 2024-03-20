import { db } from "../db.js";
import { v4 as uuid } from "uuid";

/**
 * list all pending books
 * @action_by - admin
 */

export const bookByStatus = (req, res) => {
  const query = `select b.title, t.book_id, issue_date, due_date, student_id, transaction_id from book b join transaction t on b.book_id = t.book_id where status = ?`;

  db.query(query, req.body.status, (err, data) => {
    if (err) return res.status(400).json(err);
    if (data.length) return res.status(200).json(data);
  });
};
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
 * gives list of borrowed books by the user
 * action by - USER
 */
export const borrowed = (req, res) => {
  const student_id = req.params.studentId;

  const query = `
      SELECT b.* 
      FROM book b 
      JOIN transaction t ON b.book_id = t.book_id 
      WHERE t.student_id = ? && status='approved';
  `;

  db.query(query, [student_id], (err, data) => {
    if (err) return res.status(400).json(err);
    if (data.length === 0) {
      return res.status(404).json({ error: "No book borrowed by the student" });
    }
    return res.status(200).json(data);
  });
};

/**
 * gives list of pending books by the user
 * action by - USER
 */
export const pending = (req, res) => {
  const student_id = req.params.studentId;

  const query = `
      SELECT b.* 
      FROM book b 
      JOIN transaction t ON b.book_id = t.book_id 
      WHERE t.student_id = ? && status='pending';
  `;

  db.query(query, [student_id], (err, data) => {
    if (err) return res.status(400).json(err);
    if (data.length === 0) {
      return res.status(404).json({ error: "No book pending for the student" });
    }
    return res.status(200).json(data);
  });
};

/**
 * gives list of rejected request books by the user
 * action by - USER
 */
export const denied = (req, res) => {
  const student_id = req.params.studentId;

  const query = `
      SELECT b.* 
      FROM book b 
      JOIN transaction t ON b.book_id = t.book_id 
      WHERE t.student_id = ? && status='denied';
  `;

  db.query(query, [student_id], (err, data) => {
    if (err) return res.status(400).json(err);
    if (data.length === 0) {
      return res.status(404).json({ error: "No book denied for the student" });
    }
    return res.status(200).json(data);
  });
};

/**
 * action after user request for a book
 * @ACTION_BY - ADMIN
 */
export const action = (req, res) => {
  const query = "update transaction set status = ? where transaction_id = ?";
  const params = [
    req.body.approve ? "approved" : "denied",
    req.body.transaction_id,
  ];

  db.query(query, params, (err, data) => {
    if (err) return res.status(400).json(err);

    if (req.body.approve) {
      const query =
        "update book set stock = stock - 1, borrow_count = borrow_count + 1 where book_id = ?";
      db.query(query, req.body.book_id, (err, data) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json("done");
      });
    } else {
      const query = `delete from transaction where transaction_id = ?`;
      db.query(query, req.body.transaction_id, (err, data) => {
        if (err) return res.status(400).json(err);
        return res.status(200).json("done");
      });
    }
  });
};
