import express from "express";
import { add, remove } from "../controllers/student.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();

function verifyJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).send({ message: "unauthorized access" });
  const token = auth.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

function verifyAdmin(req, res, next) {
  const userId = req.decoded.user_id;
  const query = "select * from admin where admin_id = ?";
  db.query(query, userId, (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0)
      return res.status(404).json({ message: "forbidden access" });
    next()
  });
}

router.post("/add", verifyJWT, verifyAdmin, add);
router.post("/remove", verifyJWT, remove);

export default router;
