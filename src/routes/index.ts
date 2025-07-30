import { Router} from "express"
import authRoutes from "./authRoute.js"

const router = Router()

router.use("/api/v1/auth/", authRoutes)

export default router