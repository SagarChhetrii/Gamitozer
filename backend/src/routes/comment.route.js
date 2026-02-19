import { Router } from "express";
import { addGameComment, deleteGameComment, getAllGameComments } from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";


const router = Router();


router.route("/game/:gameId")
.get(getAllGameComments)
.post(verifyToken, addGameComment);

router.route("/game/delete/:commentId").delete(verifyToken ,deleteGameComment);

export default router;