import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllGameComments = asyncHandler( async (req, res) => {
    const {gameId} = req.params;

    if(!gameId) throw new ApiError(400, "Game id is required");

    const {page = 1, limit = 20} = req.query;

    const pipeline = [
        {
            $match: {
                game: new mongoose.Types.ObjectId(gameId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
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
                owner: {
                    $first: "$owner"
                }
            }
        }
    ];

    const paginateOptions = {
        page,
        limit,
        customLabels: {
            docs: "comments",
            totalDocs: "totalComments"
        }
    };

    const allComments = await Comment.aggregatePaginate(Comment.aggregate(pipeline), paginateOptions);

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            allComments,
            "Video comments fetched successfully"
        )
    )
})

const addGameComment = asyncHandler( async (req, res) => {
    const {gameId} = req.params;
    console.log(gameId)

    if(!gameId?.trim()) throw new ApiError(400, "Game id is required");

    const {content} = req.body;

    if(!content?.trim()) throw new ApiError("Content is required");

    const addedComment = await Comment.create({
        content,
        owner: req.user?._id,
        game: gameId
    })

    if(!addedComment) throw new ApiError(500, "Something went wrong while adding comment");

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            addedComment,
            "Comment added successfully"
        )
    )
})


export {
    getAllGameComments,
    addGameComment
}