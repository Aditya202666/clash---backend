import { Router } from "express";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.js";
import { createClash } from "../controllers/clashController.js";
const router = Router();
router.post("/create", verifyJwtToken, createClash);
export default router;
