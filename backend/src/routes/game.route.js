import {Router} from "express";
import { deleteAGame, getAGame, getAllGames, publishAGame, updateGameDetails } from "../controllers/game.controller.js";
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
router.route("/:gameId").get(getAGame);
router.route("/delete/:gameId").get(verifyToken, deleteAGame);
router.route("/update/:gameId").patch(
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
    updateGameDetails
);

export default router;