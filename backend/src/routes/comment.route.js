import { Router } from "express";
import { addGameComment, getAllGameComments } from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";


const router = Router();


router.route("/game/:gameId")
.get(getAllGameComments)
.post(verifyToken, addGameComment);

export default router;