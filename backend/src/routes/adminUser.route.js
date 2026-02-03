import { Router } from "express";
import { changeUserRole } from "../controllers/adminUser.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/change-role").patch(verifyToken, verifyAdmin, changeUserRole);

export default router;