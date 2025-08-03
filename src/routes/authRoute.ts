import e, { Router } from "express";
import { registerUser, verifyEmail, verifyEmailError, verifyEmailSuccess } from "../controllers/authController.js";
import { verify } from "crypto";

const router = Router();

router.post("/register", registerUser)
router.get("/email-verify", verifyEmail)
router.get("/email-verify-error", verifyEmailError)
router.get("/email-verify-success", verifyEmailSuccess)

export default router;