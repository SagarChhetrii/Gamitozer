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
import userRoutes from "./routes/user.routes.js"
import adminUserRoutes from "./routes/adminUser.route.js"

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);

export default app;