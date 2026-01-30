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

export default app;