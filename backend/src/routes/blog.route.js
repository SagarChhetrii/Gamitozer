import { Router } from "express";
import { getAllBlogs } from "../controllers/blog.controller.js";

const router = Router();


router.route("/")
.get(getAllBlogs)

export default router;