import {Router} from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { toggleBlogLike, toggleGameLike } from "../controllers/like.controller.js";


const router = Router();

router.use(verifyToken)

router.route("/game-toggle/:gameId").patch(toggleGameLike);

router.route("/blog-toggle/:blogId").patch(toggleBlogLike);

export default router;