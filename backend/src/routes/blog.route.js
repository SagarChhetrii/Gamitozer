import { Router } from "express";
import { getAllBlogs, publishABlog } from "../controllers/blog.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.route("/")
.get(getAllBlogs)
.post(
    verifyToken,
    upload.single("imageFile"),
    publishABlog
)

export default router;