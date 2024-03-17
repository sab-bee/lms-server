import { db } from "../db.js";

export const add = (req, res) => {
  const query =
    "insert into book(`title`, `author`,`genre`,`edition`,`description`,`stock`, `borrow_count`, `image`) values(?)";

  const {
    title,
    author,
    genre,
    edition,
    stock,
    borrow_count,
    image,
    description,
  } = req.body;

  const values = [
    title,
    author,
    genre,
    edition,
    description,
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

export const list = (req, res) => {
  let query = "";
  if (req.query.type === "latest") {
    query = `SELECT *
    FROM book
    ORDER BY book_id DESC
    LIMIT ?;`;
  }
  if (req.query.type === "top") {
    query = `SELECT *
    FROM book
    ORDER BY borrow_count DESC
    LIMIT ?;`;
  }

  db.query(query, Number(req.query.limit), (err, data) => {
    if (err) return res.status(400).json(err);
    if (data.length) {
      return res.status(200).json(data);
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
