import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app = express();

const ALLOWED_ORIGIN = [
    process.env.DEV_ORIGIN
]

app.use(
    cors({
        origin: ALLOWED_ORIGIN,
        credentials: true
    })
);

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//Routes
import userRoutes from "./routes/user.routes.js";
import adminUserRoutes from "./routes/adminUser.route.js";
import gameRoutes from "./routes/game.route.js";
import blogRoutes from "./routes/blog.route.js";
import commentRoutes from "./routes/comment.route.js";
import likeRoutes from "./routes/like.route.js";
import subscriptionRoutes from "./routes/subscription.route.js";
import collectionRoutes from "./routes/collection.route.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/games", gameRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/collections", collectionRoutes);

export default app;