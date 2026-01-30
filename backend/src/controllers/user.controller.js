import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { log } from "node:console";


const userRegister = asyncHandler( async (req, res) => {
    const {username, email, fullname, password} = req.body;

    if(!username || !email || !fullname || !password) return new ApiError(404, "All fields are required");

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    });

    if(existedUser) return new ApiError(409, "User already exist");

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        password,
        avatar: "",
        refreshToken: ""
    })

    if(!user) return new ApiError(505, "Error creating user in DB");

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

export {
    userRegister
}