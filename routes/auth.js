import express from "express";
import {
  register,
  login,
  logout,
  verifyEmail,
  otpCheck,
  setPass,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verifyEmail", verifyEmail);
router.post("/otpCheck", otpCheck);
router.post("/setPass", setPass);

export default router;
