import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { publishACollection } from "../controllers/collection.controller.js";

const router = Router();

router.route("/")
.post(verifyToken, publishACollection);

export default router;