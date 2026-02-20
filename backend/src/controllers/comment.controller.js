import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllGameComments = asyncHandler( async (req, res) => {
    const {gameId} = req.params;

    if(!gameId?.trim()) throw new ApiError(400, "Game id is required");

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
            "Game comments fetched successfully"
        )
    )
})

const addGameComment = asyncHandler( async (req, res) => {
    const {gameId} = req.params;

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

const getAllBlogComments = asyncHandler( async (req, res) => {
    const {blogId} = req.params;
    if(!blogId?.trim()) throw new ApiError(400, "Blog id is required");

    const {page = 1, limit = 20} = req.query;

    const pipeline = [
        {
            $match: {
                blog: new mongoose.Types.ObjectId(blogId)
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
            "Blog comments fetched successfully"
        )
    )
})

const addBlogComment = asyncHandler( async (req, res) => {
    const {blogId} = req.params;

    if(!blogId?.trim()) throw new ApiError(400, "Blog id is required");

    const {content} = req.body;

    if(!content?.trim()) throw new ApiError("Content is required");

    const addedComment = await Comment.create({
        content,
        owner: req.user?._id,
        blog: blogId
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

const deleteComment = asyncHandler( async (req, res) => {
    const {commentId} = req.params;

    if(!commentId) throw new ApiError(400, "Game id is required");

    const savedComment = await Comment.findById(commentId);

    if(!savedComment) throw new ApiError(400, "Comment does not exist");
    if(!savedComment.owner.equals(req.user?._id)) throw new ApiError(401, "Unauthorized action");

    const commentDeletedResponse = await Comment.deleteOne({_id: savedComment._id});

    if(!commentDeletedResponse.acknowledged) throw new ApiError(500, "Something went wrong while deleting comment");

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            null,
            "Comment deleted successfully"
        )
    )
})

const editComment = asyncHandler( async (req, res) => {
    const {commentId} = req.params;

    if(!commentId) throw new ApiError(400, "Comment id is required");

    const {content} = req.body;

    if(!content?.trim()) throw new ApiError(400, "Content is required");

    const comment = await Comment.findById(commentId);

    if(!comment) throw new ApiError(400, "Comment does not exist");
    if(!comment.owner.equals(req.user?._id)) throw new ApiError(401, "Unauthorized action");

    comment.content = content;
    await comment.save({validateBeforeSave: false});

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            comment,
            "Comment edited successfully"
        )
    )
})


export {
    getAllGameComments,
    addGameComment,
    getAllBlogComments,
    addBlogComment,
    deleteComment,
    editComment
}