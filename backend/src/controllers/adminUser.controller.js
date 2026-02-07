import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
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

const getUsersDashboard = asyncHandler( async ( req, res) => {
    const {page = 1, limit = 10, name, role} = req.query;
    const pipeline = [{
        $project: {
            password: 0,
            refreshToken: 0
        }
    }];

    if(name) {
        pipeline.push({
            $match: {
                fullname: {
                    $regex: name,
                    $options: "i"
                }
            }
        })
    }

    if(role) {
        pipeline.push({
            $match: {
                role
            }
        })
    }

    const paginateOptions = {
        page,
        limit,
        customLabels: {
            docs: "users"
        }
    }

    const users = await User.aggregatePaginate(User.aggregate(pipeline), paginateOptions);

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            users,
            "Users fetched successfully"
        )
    )
})

export {
    changeUserRole,
    getUsersDashboard
}