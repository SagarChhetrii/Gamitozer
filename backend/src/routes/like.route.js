import {Router} from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getLikedGames, toggleBlogLike, toggleCommentLike, toggleGameLike } from "../controllers/like.controller.js";


const router = Router();

router.use(verifyToken)

router.route("/game-toggle/:gameId").patch(toggleGameLike);

router.route("/blog-toggle/:blogId").patch(toggleBlogLike);

router.route("/comment-toggle/:commentId").patch(toggleCommentLike);

router.route("/game").get(getLikedGames);

export default router;