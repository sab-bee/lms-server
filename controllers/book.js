import { db } from "../db.js";

/**
 * add book to the BOOK TABLE
 * action by - ADMIN
 */
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
    if (err) return res.status(400).json(err);
    return res.status(200).json({ ...data, message: "added" });
  });
};

/**
 * remove book to the BOOK TABLE
 * action by - ADMIN
 */

export const remove = (req, res) => {
  const query = "select * from book where book_id = ?";
  db.query(query, req.body.book_id, (err, data) => {
    if (err) return res.status(400).json(err);
    if (data.length === 0)
      return res.status(404).json({ messasge: "book not found" });

    const query = "delete from book where book_id = ?";
    db.query(query, req.body.book_id, (err, data) => {
      if (err) return res.status(400).json(err);
      return res.json({ ...data, message: "deleted book" });
    });
  });
};

/**
 * search book by keyword
 * action by - USER
 */
export const search = (req, res) => {
  const query = "select * from book where title like ? or author like ?";
  const value = `%${req.body.query}%`;
  db.query(query, [value, value], (err, data) => {
    if (err) return res.status(400).json(err);
    if (data.length) {
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "no book found" });
    }
  });
};

/**
 * get book using book id
 * this for single product show of
 * borrow page
 * action by - USER
 */
export const getbookbyid = (req, res) => {
  const query = "select * from book where book_id = ?";
  db.query(query, req.body.book_id, (err, data) => {
    if (err) return res.status(400).json(err);
    if (data.length) {
      return res.status(200).json(data[0]);
    } else {
      return res.status(404).json({ message: "no book found" });
    }
  });
};

/**
 * sends all the books for LIBRARY page
 * action by - USER
 */
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
