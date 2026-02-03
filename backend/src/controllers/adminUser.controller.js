import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";


const changeUserRole = asyncHandler( async ( req, res) => {
    const {userId, role} = req.body;

    if(!userId || !role) throw new ApiError(400, "All fields are required");

    const user = await User.findById(userId).select("-password -refreshToken");

    if(!user) throw new ApiError(404, "User not found");

    if(user.role === role) throw new ApiError(400, "User already has this role");

    user.role = role;
    await user.save({validateBeforeSave: false});

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            user,
            "User role changed successfully"
        )
    )
})

export {
    changeUserRole
}