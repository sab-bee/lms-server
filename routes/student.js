import express from "express";
import { add, remove } from "../controllers/student.js";
import { verifyAdmin, verifyJWT } from "../middleware/verify.js";

const router = express.Router();

router.post("/add", verifyJWT, verifyAdmin, add);
router.post("/remove", verifyJWT, verifyAdmin, remove);

export default router;
