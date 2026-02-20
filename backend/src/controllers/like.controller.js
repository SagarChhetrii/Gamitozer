import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleGameLike = asyncHandler( async (req, res) => {
    const {gameId} = req.params;

    if(!gameId?.trim()) throw new ApiError(400, "Game id is required");

    let likedGame = await Like.findOne({
        game: gameId,
        likedBy: req.user?._id
    });

    if(likedGame) {
        const unLikeResponse = await Like.deleteOne({
            game: gameId,
            likedBy: req.user?._id
        })

        if(!unLikeResponse.acknowledged) throw new ApiError(500, "Something went wrong while toggling like");
        likedGame = null;
    } else {
        likedGame =  await Like.create({
            game: gameId,
            likedBy: req.user?._id
        })
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            201,
            likedGame,
            "Game like toggled successfully"
        )
    )
})

const toggleBlogLike = asyncHandler( async (req, res) => {
    const {blogId} = req.params;

    if(!blogId?.trim()) throw new ApiError(400, "Blog id is required");

    let likedBlog = await Like.findOne({
        blog: blogId,
        likedBy: req.user?._id
    });

    if(likedBlog) {
        const unLikeResponse = await Like.deleteOne({
            blog: blogId,
            likedBy: req.user?._id
        })

        if(!unLikeResponse.acknowledged) throw new ApiError(500, "Something went wrong while toggling like");
        likedBlog = null;
    } else {
        likedBlog =  await Like.create({
            blog: blogId,
            likedBy: req.user?._id
        })
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            201,
            likedBlog,
            "Game like toggled successfully"
        )
    )
})

const toggleCommentLike = asyncHandler( async (req, res) => {
    const {commentId} = req.params;

    if(!commentId?.trim()) throw new ApiError(400, "Comment id is required");

    let likedComment = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    });

    if(likedComment) {
        const unLikeResponse = await Like.deleteOne({
            comment: commentId,
            likedBy: req.user?._id
        })

        if(!unLikeResponse.acknowledged) throw new ApiError(500, "Something went wrong while toggling like");
        likedComment = null;
    } else {
        likedComment =  await Like.create({
            comment: commentId,
            likedBy: req.user?._id
        })
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            201,
            likedComment,
            "Game like toggled successfully"
        )
    )
})

const getLikedGames = asyncHandler( async (req, res) => {
    const {page = 1, limit = 10, searchQuery} = req.query;

    const pipeline = [
        {
            $match: {
                likedBy: req.user?._id,
                game: {
                    $exists: true,
                    $type: "objectId"
                }
            }
        },
        {
            $lookup: {
                from: "games",
                localField: "game",
                foreignField: "_id",
                as: "likedGames",
                pipeline: [
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
                    },
                    {
                        $project: {
                            title: 1,
                            banner: 1,
                            tags: 1,
                            owner: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                likedGames: {
                    $first: "$likedGames"
                }
            }
        },
        {
            $replaceRoot: {
                newRoot: "$likedGames"
            }
        }
    ];

    if(searchQuery) {
        pipeline.push(
            {
                $match: {
                    "likedGames.title": {
                        $regex: searchQuery,
                        $options: "i"
                    }
                }
            }
        )
    }

    const paginateOptions = {
        page,
        limit,
        customLabels: {
            docs: "likedGames",
            totalDocs: "totalLikedGames"
        }
    }

    const likedGames = await Like.aggregatePaginate(Like.aggregate(pipeline), paginateOptions);

    console.log(likedGames)

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            likedGames,
            "Liked games fetched successfully"
        )
    )
})


export {
    toggleGameLike,
    toggleBlogLike,
    toggleCommentLike,
    getLikedGames
}