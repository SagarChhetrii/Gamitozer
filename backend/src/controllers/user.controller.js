import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 10 * 24 * 60 * 60 * 1000,
}

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        if(!user) throw new ApiError(401, "User does not exist");
        
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken}
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong while generating token");
    }
}


//controllers
const userRegister = asyncHandler( async (req, res) => {
    const {username, email, fullname, password} = req.body;

    if(!username || !email || !fullname || !password) throw new ApiError(400, "All fields are required");

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    });

    if(existedUser) throw new ApiError(400, "User already exist");

    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath) throw new ApiError(400, "Avatar is required");

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar) throw new ApiError(500, "Something went wrong while uploading file on cloudinary");

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        password,
        avatar: avatar.secure_url,
        refreshToken: ""
    })

    if(!user) throw new ApiError(505, "Something went wrong while creating user in DB");

    const currentUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            currentUser,
            "User registered successfully"
        )
    )
})

const userLogin = asyncHandler( async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password) throw new ApiError(400, "All fields are required");

    const user = await User.findOne({username});

    if(!user) throw new ApiError(401, "User does not exist");

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) throw new ApiError(400, "Password incorrect");

    const {accessToken, refreshToken} = await generateTokens(user._id);

    const currentUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(
            200,
            currentUser,
            "User logged in successfully"
        )
    )
})

const userLogout = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            refreshToken: ""
        }
    }, {
        new: true
    });

    res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
        new ApiResponse(
            200,
            null,
            "User logged out successfully"
        )
    )
})

const refreshAccessToken = asyncHandler( async (req, res) => {
    const incomingToken = req?.cookies?.refreshToken || req?.body?.refreshToken || "";

    if(!incomingToken) throw new ApiError(401, "Unauthorized Request");

    try {
        const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET_KEY);

        const user = await User.findById(decoded._id);

        if(!user) throw new ApiError(401, "Invalid Refresh Token :: User not found");

        if(incomingToken !== user.refreshToken) throw new ApiError(401, "Refresh token expired or used");

        const {accessToken, refreshToken} = await generateTokens(user._id);

        res
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                201,
                {
                    accessToken,
                    refreshToken,
                },
                "Refreshed access token successfully"
            )
        )
    } catch (error) {
        throw new ApiError(505, "Something went wrong refreshing access token");
    }
})

const resetPassword = asyncHandler( async (req, res) => {
    const {newPassword, username} = req.body;

    if(!username) throw new ApiError(401, "Username is required");
    if(!newPassword) throw new ApiError(401, "New password is required");

    const user = await User.findOne({
        username
    });

    if(!user) throw new ApiError(401, "No user found");
    console.log(user);

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            "Password reset successful"
        )
    )
})

const getCurrentUser = asyncHandler( async (req, res) => {
    const currentUser = await User.findById(req.user?._id).select("-password -refreshToken");

    if(!currentUser) throw new ApiError(401, "Token expired or used");

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            currentUser,
            "User data fetched successfully"
        )
    )
})

const updateUserAvatar = asyncHandler( async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath) throw new ApiError(401, "New avatar is required") 

    const newAvatar = await uploadOnCloudinary(avatarLocalPath);

    if(!newAvatar) throw new ApiError(505, "Something went wrong while uploading file on cloudinary");

    const user = await User.findById(req.user?._id).select("-password -refreshToken");
    
    const previousAvatar = user.avatar;

    user.avatar = newAvatar.secure_url;
    await user.save({validateBeforeSave: false});

    const deleteResponse = await deleteFromCloudinary(previousAvatar);

    if(!deleteResponse) console.log("Previous avatar is not deleted from cloudinary");

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            {
                avatar: user.avatar 
            },
            "Avatar updated successfully"
        )
    )
})

const updateUserDetail = asyncHandler( async (req ,res) => {
    const {fullname} = req.body;

    if(!fullname) throw new ApiError(400, "New fullname is required");

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullname
        }
    }, {
        new: true
    }).select("-password -refreshToken")

    if(!user) throw new ApiError(401, "User not found");

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            user,
            "User detail updated successfully"
        )
    )
})

export {
    userRegister,
    userLogin,
    userLogout,
    refreshAccessToken,
    resetPassword,
    getCurrentUser,
    updateUserAvatar,
    updateUserDetail
}