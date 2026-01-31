import {Router} from "express";
import { refreshAccessToken, resetPassword, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").get(verifyToken, userLogout);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/reset-password").patch(verifyToken, resetPassword)

export default router;