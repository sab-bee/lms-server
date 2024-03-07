import express from "express";
import { request, action } from "../controllers/transaction.js";
import { verifyAdmin, verifyJWT } from "../middleware/verify.js";
const router = express.Router();

router.post("/request", verifyJWT, request);
router.post("/action", verifyJWT, verifyAdmin, action);
export default router;
