import { Router } from "express";
import { loginUser, registerUser, checkCredentials, verifyEmail, verifyEmailError, verifyEmailSuccess, forgotPassword, resetPassword, } from "../controllers/authController.js";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.js";
import { authRateLimiter } from "../config/rateLimiter.js";
const router = Router();
router.use(authRateLimiter);
router.post("/register", registerUser);
router.get("/email-verify", verifyEmail);
router.get("/email-verify-error", verifyEmailError);
router.get("/email-verify-success", verifyEmailSuccess);
router.post("/check/credentials", checkCredentials);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/user", verifyJwtToken, async (req, res) => {
    res.json({
        user: req.user,
    });
});
export default router;
