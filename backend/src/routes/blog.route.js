import { Router } from "express";
import { deleteABlog, getAllBlogs, publishABlog, updateABlog } from "../controllers/blog.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.route("/")
.get(getAllBlogs)
.post(
    verifyToken,
    upload.single("imageFile"),
    publishABlog
);
router.route("/delete/:blogId").delete(verifyToken, deleteABlog);
router.route("/update/:blogId").patch(
    verifyToken,
    upload.single("imageFile"),
    updateABlog
)

export default router;