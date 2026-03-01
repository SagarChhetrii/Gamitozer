import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getUserCollections, publishACollection } from "../controllers/collection.controller.js";

const router = Router();

router.route("/")
.post(verifyToken, publishACollection);

router.route("/:userId").get(getUserCollections);

export default router;