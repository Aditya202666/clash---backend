import { Router} from "express"
import authRoutes from "./authRoute.js"
import clashRoutes from "./clashRoute.js"

const router = Router()

router.use("/api/v1/auth", authRoutes)
router.use("/api/v1/clash", clashRoutes)

export default router 