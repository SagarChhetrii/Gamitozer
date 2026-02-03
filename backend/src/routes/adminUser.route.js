import { Router } from "express";
import { changeUserRole, getUsersDashboard } from "../controllers/adminUser.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/change-role").patch(verifyToken, verifyAdmin, changeUserRole);
router.route("/dashboard").get(verifyToken, verifyAdmin, getUsersDashboard);

export default router;