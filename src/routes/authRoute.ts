import e, { Router } from "express";
import {
  loginUser,
  registerUser,
  verifyCredentials,
  verifyEmail,
  verifyEmailError,
  verifyEmailSuccess,
} from "../controllers/authController.js";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.js";

const router = Router();

router.post("/register", registerUser);

router.get("/email-verify", verifyEmail);
router.get("/email-verify-error", verifyEmailError);
router.get("/email-verify-success", verifyEmailSuccess);

router.post("/verify-credentials", verifyCredentials);
router.post("/login", loginUser);

router.get("/user", verifyJwtToken, async(req, res) => {
  res.json({
    user: req.user
  })
}); 

export default router;
