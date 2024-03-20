import express from "express";
import {
  request,
  action,
  denied,
  pending,
  borrowed,
  bookByStatus,
} from "../controllers/transaction.js";
import { verifyAdmin, verifyJWT } from "../middleware/verify.js";
const router = express.Router();

router.post("/request", verifyJWT, request);
router.get("/borrowed/:studentId", verifyJWT, borrowed);
router.get("/pending/:studentId", verifyJWT, pending);
router.get("/denied/:studentId", verifyJWT, denied);
router.post("/action", verifyJWT, verifyAdmin, action);
router.post("/bookbystatus", verifyJWT, verifyAdmin, bookByStatus);

export default router;
