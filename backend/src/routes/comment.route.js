import { Router } from "express";
import { addBlogComment, addCommentComment, addGameComment, deleteComment, editComment, getAllBlogComments, getAllCommentComments, getAllGameComments } from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";


const router = Router();


router.route("/game/:gameId")
.get(getAllGameComments)
.post(verifyToken, addGameComment);

router.route("/blog/:blogId")
.get(getAllBlogComments)
.post(verifyToken, addBlogComment);

router.route("/comment/:commentId")
.get(getAllCommentComments)
.post(verifyToken, addCommentComment);

router.route("/delete/:commentId").delete(verifyToken, deleteComment);
router.route("/edit/:commentId").patch(verifyToken, editComment);

export default router;