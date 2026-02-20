import { Router } from "express";
import { addBlogComment, addGameComment, deleteComment, editComment, getAllBlogComments, getAllGameComments } from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";


const router = Router();


router.route("/game/:gameId")
.get(getAllGameComments)
.post(verifyToken, addGameComment);

router.route("/blog/:blogId")
.get(getAllBlogComments)
.post(verifyToken, addBlogComment);

router.route("/delete/:commentId").delete(verifyToken, deleteComment);
router.route("/edit/:commentId").patch(verifyToken, editComment);

export default router;