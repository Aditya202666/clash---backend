import { Router} from "express"
import authRoutes from "./authRoute.js"
import clashRoutes from "./clashRoute.js"
import clashItemRoute from "./clashItemRoute.js"

const router = Router()

router.use("/api/v1/auth", authRoutes)
router.use("/api/v1/clash", clashRoutes)
router.use("/api/v1/clashItem", clashItemRoute)

export default router 