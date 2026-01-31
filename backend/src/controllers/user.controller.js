import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

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
        console.log(accessToken);

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token");
    }
}

const userRegister = asyncHandler( async (req, res) => {
    const {username, email, fullname, password} = req.body;

    if(!username || !email || !fullname || !password) throw new ApiError(404, "All fields are required");

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    });

    if(existedUser) throw new ApiError(400, "User already exist");

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        password,
        avatar: "",
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

export {
    userRegister,
    userLogin
}