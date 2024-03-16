import express from "express";
import {
  add,
  borrowed,
  denied,
  getbookbyid,
  pending,
  remove,
  search,
} from "../controllers/book.js";
import { verifyAdmin, verifyJWT } from "../middleware/verify.js";
const router = express.Router();

router.post("/add", verifyJWT, verifyAdmin, add);
router.delete("/remove", verifyJWT, verifyAdmin, remove);
router.get("/borrowed/:studentId", verifyJWT, borrowed);
router.get("/pending/:studentId", verifyJWT, pending);
router.get("/denied/:studentId", verifyJWT, denied);
router.post("/search", verifyJWT, search);
router.post("/getbookbyid", verifyJWT, getbookbyid);

export default router;
