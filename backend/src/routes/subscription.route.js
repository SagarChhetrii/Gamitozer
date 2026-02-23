import {Router} from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getUserFollowers, getUserFollowings, toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyToken);

router.route("/toggle/:developerId").patch(toggleSubscription);
router.route("/follower/:userId").get(getUserFollowers);
router.route("/following/:userId").get(getUserFollowings);

export default router;