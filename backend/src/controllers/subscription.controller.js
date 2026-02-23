import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler( async (req, res) => {
    const {developerId} = req.params;

    if(!developerId?.trim()) throw new ApiError(400, "Developer id is required");

    let subscribed = await Subscription.findOne({
        follower: req.user?._id,
        developer: developerId
    })

    if(subscribed) {
        const unsubscribedResponse = await Subscription.deleteOne({
            follower: req.user?._id,
            developer: developerId
        });

        if(!unsubscribedResponse.acknowledged) throw new ApiError(500, "Something went wrong while toggling subscription");
        subscribed = null;
    } else {
        subscribed = await Subscription.create({
            follower: req.user?._id,
            developer: developerId
        })
    }

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            subscribed,
            "Subscription toggled successfully"
        )
    )
})

const getUserFollowers = asyncHandler( async ( req, res) => {
    const {userId} = req.params;

    if(!userId?.trim()) throw new ApiError(400, "User id is needed");

    const {page = 1, limit = 10} = req.query;

    const pipeline = [
        {
            $match: {
                developer: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "follower",
                foreignField: "_id",
                as: "follower",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                follower: {
                    $first: "$follower"
                }
            }
        },
        {
            $project: {
                follower: 1
            }
        },
        {
            $replaceRoot:{
                newRoot: "$follower"
            }
        }
    ]

    const paginateOptions = {
        page,
        limit,
        customLabels: {
            docs: "followers",
            totalDocs: "totalFollowers"
        }
    }

    const followers = await Subscription.aggregatePaginate(Subscription.aggregate(pipeline), paginateOptions);

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            followers,
            "Followers fetched successfully"
        )
    )
})

export {
    toggleSubscription,
    getUserFollowers
}