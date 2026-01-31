import {Router} from "express";
import { userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").get(verifyToken, userLogout);

export default router;