import { db } from "../db.js";
import { v4 as uuid } from "uuid";

export const add = (req, res) => {
  const query =
    "insert into book(`book_id`,`title`, `author`,`genre`,`edition`,`stock`, `borrow_count`, `image`) values(?)";

  const { title, author, genre, edition, stock, borrow_count, image } =
    req.body;
  const values = [
    uuid(),
    title,
    author,
    genre,
    edition,
    stock,
    borrow_count,
    image,
  ];

  db.query(query, [values], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json({ ...data, message: "added" });
  });
};

export const remove = (req, res) => {
  const query = "select * from book where book_id = ?";
  db.query(query, req.body.book_id, (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0)
      return res.status(404).json({ messasge: "book not found" });

    const query = "delete from book where book_id = ?";
    db.query(query, req.body.book_id, (err, data) => {
      if (err) return res.json(err);
      return res.json({ ...data, message: "deleted book" });
    });
  });
};

export const search = (req, res) => {
  const query = "select * from book where title like ? or author like ?";
  db.query(
    query,
    [`%${req.body.query}%`, `%${req.body.query}%`],
    (err, data) => {
      if (err) return res.json(err);
      if (data.length) {
        return res.status(200).json(data);
      } else {
        return res.status(404).json({ message: "no book found" });
      }
    }
  );
};

export const getbookbyid = (req, res) => {
  const query = "select * from book where book_id = ?";
  db.query(query, req.body.book_id, (err, data) => {
    if (err) return res.json(err);
    if (data.length) {
      return res.status(200).json(data[0]);
    } else {
      return res.status(404).json({ message: "no book found" });
    }
  });
};

export const borrowed = (req, res) => {
  const student_id = req.params.studentId;

  const query = `
      SELECT b.* 
      FROM book b 
      JOIN transaction t ON b.book_id = t.book_id 
      WHERE t.student_id = ? && status='approved';
  `;

  db.query(query, [student_id], (err, data) => {
    if (err) return err;
    if (data.length === 0) {
      return res.status(404).json({ error: "No book borrowed by the student" });
    }
    return res.status(200).json(data);
  });
};

export const pending = (req, res) => {
  const student_id = req.params.studentId;

  const query = `
      SELECT b.* 
      FROM book b 
      JOIN transaction t ON b.book_id = t.book_id 
      WHERE t.student_id = ? && status='pending';
  `;

  db.query(query, [student_id], (err, data) => {
    if (err) return err;
    if (data.length === 0) {
      return res.status(404).json({ error: "No book pending for the student" });
    }
    return res.status(200).json(data);
  });
};

export const denied = (req, res) => {
  const student_id = req.params.studentId;

  const query = `
      SELECT b.* 
      FROM book b 
      JOIN transaction t ON b.book_id = t.book_id 
      WHERE t.student_id = ? && status='denied';
  `;

  db.query(query, [student_id], (err, data) => {
    if (err) return err;
    if (data.length === 0) {
      return res.status(404).json({ error: "No book denied for the student" });
    }
    return res.status(200).json(data);
  });
};
