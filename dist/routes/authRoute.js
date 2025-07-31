import { Router } from "express";
import { registerUser, verifyEmail, verifyEmailError } from "../controllers/authController.js";
const router = Router();
router.post("/register", registerUser);
router.get("/email-verify", verifyEmail);
router.get("/email-verify-error", verifyEmailError);
export default router;
