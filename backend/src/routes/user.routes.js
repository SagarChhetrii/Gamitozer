import {Router} from "express";
import { getCurrentUser, refreshAccessToken, resetPassword, updateUserAvatar, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(verifyToken, getCurrentUser)
router.route("/register").post(
     upload.single("avatar"),
     userRegister
);
router.route("/login").post(userLogin);
router.route("/logout").get(verifyToken, userLogout);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/reset-password").patch(verifyToken, resetPassword)
router.route("/update/avatar").patch(
    verifyToken,
    upload.single("avatar"),
    updateUserAvatar
)

export default router;