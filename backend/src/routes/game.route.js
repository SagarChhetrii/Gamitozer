import {Router} from "express";
import { getAllGames, publishAGame } from "../controllers/game.controller.js";
import {verifyToken} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();


router.route("/")
.get(getAllGames)
.post(
    verifyToken,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
            limits: {fileSize: 1024 * 1024 * 500}
        },
        {
            name: "bannerFile",
            maxCount: 1
        }
    ]),
    publishAGame
)

export default router;