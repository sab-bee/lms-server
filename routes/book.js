import express from "express";
import {
  add,
  getbookbyid,
  list,
  quickSearch,
  remove,
  search,
} from "../controllers/book.js";
import { verifyAdmin, verifyJWT } from "../middleware/verify.js";
const router = express.Router();

router.post("/add", verifyJWT, verifyAdmin, add);
router.delete("/remove", verifyJWT, verifyAdmin, remove);
router.post("/search", verifyJWT, search);
router.post("/quicksearch", verifyJWT, quickSearch);
router.post("/getbookbyid", verifyJWT, getbookbyid);
router.get("/list", verifyJWT, list);

export default router;
