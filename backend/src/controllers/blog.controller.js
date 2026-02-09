import { Blog } from "../models/blog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { ApiError } from "../utils/ApiError.js"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

const publishABlog = asyncHandler( async (req, res) => {
    const {content, gameId} = req.body;

    if(!content) throw new ApiError(400, "Content is required");

    const imageLocalPath = req.field[0]?.path;
    let image;
    if(imageLocalPath) {
        image = await uploadOnCloudinary(imageLocalPath);
    }

    const blog = await Blog.create({
        content,
        owner: req.user?._id,
        game: gameId || "",
        image: image?.secure_url || "",
    })

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            blog,
            "Blog created successfully"
        )
    )
})

const deleteABlog = asyncHandler( async (req, res) => {
    const {gameId} = req.params;

    if(gameId) throw new ApiError(400, "Game id is required");

    const blog = await Blog.findById(gameId);

    if(!blog) throw new ApiError(400, "Blog not found");
    if(!blog.owner.equals(req.user?._id)) throw new ApiError(401, "Unauthorised action");

    const deletedResponse = await Blog.deleteOne({ _id: blog._id });

    if(!deletedResponse.acknowledged) throw new ApiError(500, "Something went wrong while deleting blog");

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "Blog deleted successfully"
        )
    )
})

export {
    getAllBlogs,
    publishABlog
}