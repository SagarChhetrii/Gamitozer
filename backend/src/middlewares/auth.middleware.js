import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const verifyToken = asyncHandler( async (req, _, next) => {
    if(!(req?.cookies || req?.cookies?.accessToken) && !req.header("Authorization")) throw new ApiError(401, "Unauthorized Request");

    try {
        const token = req.cookies.accessToken || req.header("Authorization").replace("Bearer ", "");

        if(!token) throw new ApiError(401, "Unauthorized Request");

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

        const user = await User.findById(decoded._id).select(
            "-password -refreshToken"
        )

        if(!user) throw new ApiError(401, "Invalid access token");

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(505, "Something went wrong while verifying token :: User may not be logged in");
    }
})

const verifyAdmin = asyncHandler( async (req, _, next) => {
    if(req.user?.role !== "admin") throw new ApiError(401, "Unauthorized Admin Request");
    next();
})

export {verifyToken, verifyAdmin}