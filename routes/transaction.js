import express from "express";
import {
  request,
  action,
  denied,
  pending,
  borrowed,
} from "../controllers/transaction.js";
import { verifyAdmin, verifyJWT } from "../middleware/verify.js";
const router = express.Router();

router.post("/request", verifyJWT, request);
router.post("/action", verifyJWT, verifyAdmin, action);
router.get("/borrowed/:studentId", verifyJWT, borrowed);
router.get("/pending/:studentId", verifyJWT, pending);
router.get("/denied/:studentId", verifyJWT, denied);

export default router;