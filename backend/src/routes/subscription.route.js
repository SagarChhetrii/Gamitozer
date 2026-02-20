import {Router} from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyToken);

router.route("/toggle/:developerId").patch(toggleSubscription);

export default router;