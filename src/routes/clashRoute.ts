import { Router } from "express";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.js";
import { createClash, getAllClashes, getClash, updateBanner, updateClashDetails } from "../controllers/clashController.js";
import { upload } from "../middlewares/multer.js";


const router = Router();




router.get("/", verifyJwtToken, getAllClashes)
router.get("/:id", verifyJwtToken, getClash)
router.post("/", verifyJwtToken, upload.single("banner"), createClash)
router.put("/:id", verifyJwtToken, updateClashDetails)
router.put("/:id/:banner_id", verifyJwtToken, upload.single("banner"), updateBanner)




export default router