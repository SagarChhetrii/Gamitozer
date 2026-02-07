import { Blog } from "../models/blog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllBlogs = asyncHandler( async (req, res) => {
    const {page = 1, limit = 10} = req.query;

    const pipeline = [
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
            },
        },
        {
            $lookup: {
                from: "games",
                localField: "game",
                foreignField: "_id",
                as: "game",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                        }
                    }
                ]
            },
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                game: {
                    $first: "$game"
                }
            }
        }
    ];

    const paginateOptions = {
        page,
        limit,
        customLabels: {
            docs: "blogs"
        }
    }

    const blogs = await Blog.aggregatePaginate(Blog.aggregate(pipeline), paginateOptions);

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            blogs,
            "Blogs fetched successfully"
        )
    )
})

export {
    getAllBlogs
}