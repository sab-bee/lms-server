import express from "express";
import {
  add,
  getbookbyid,
  list,
  remove,
  search,
} from "../controllers/book.js";
import { verifyAdmin, verifyJWT } from "../middleware/verify.js";
const router = express.Router();

router.post("/add", verifyJWT, verifyAdmin, add);
router.delete("/remove", verifyJWT, verifyAdmin, remove);
router.post("/search", verifyJWT, search);
router.post("/getbookbyid", verifyJWT, getbookbyid);
router.get("/list", verifyJWT, list);

export default router;
