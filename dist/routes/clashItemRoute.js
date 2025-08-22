import { Router } from "express";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.js";
import { upload } from "../middlewares/multer.js";
import { createClashItem } from "../controllers/clashItemController.js";
const router = Router();
router.post("/:id/create", verifyJwtToken, upload.array("clash_items[]", 2), createClashItem);
export default router;
