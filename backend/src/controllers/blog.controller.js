import { Blog } from "../models/blog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { ApiError } from "../utils/ApiError.js"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const getAllBlogs = asyncHandler( async (req, res) => {
    const {page = 1, limit = 10, searchQuery} = req.query;

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

    if(searchQuery) {
        pipeline.push(
            {
                $match: {
                    "owner.fullname": {
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
    const {content, gameId} = req.body || {};

    if(!content) throw new ApiError(400, "Content is required");

    const imageLocalPath = req.file?.path;
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
    const {blogId} = req.params;

    if(!blogId) throw new ApiError(400, "Game id is required");

    const blog = await Blog.findById(blogId);

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

const updateABlog = asyncHandler( async (req, res) => {
    const {blogId} = req.params;

    if(!blogId) throw new ApiError(400, "Blog id is required");

    const {content, gameId} = req.body || {};
    const imageLocalPath = req.file?.path;
    
    if(!content?.trim() && !gameId?.trim() && !imageLocalPath?.trim()) throw new ApiError(400, "Atleast one field is required");

    const blog = await Blog.findById(blogId);

    if(!blog) throw new ApiError(400, "Blog does not exist");
    if(!blog.owner.equals(req.user?._id)) throw new ApiError(401, "Unauthorized action");

    if(content) {
        blog.content = content;
    }
    if(gameId) {
        blog.game = gameId;
    }
    if(imageLocalPath) {
        const oldImageUrl = blog.image;
        
        const image = await uploadOnCloudinary(imageLocalPath);
        if(!image) throw new ApiError(500, "Something went wrong while uploading image on Cloudinary");

        blog.image = image;
        const imageDeletedResponse = await deleteFromCloudinary(oldImageUrl);
        if(!imageDeletedResponse) console.log("Something went wrong with deleting image from cloudinary");
    }

    await blog.save({validateBeforeSave: false});

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            blog,
            "Blog updated successfully"
        )
    )
})

const getABlog = asyncHandler( async (req , res) => {
    const {blogId} = req.params
    if(!blogId) throw new ApiError(400, "Blog id is required");

    const blog = await Blog.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(blogId)
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
            $lookup: {
                from: "games",
                localField: "game",
                foreignField: "_id",
                as: "game",
                pipeline: [
                    {
                        $project: {
                            title: 1
                        }
                    }
                ]
            }
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
    ]);

    console.log(blog);

    if(!blog) throw new ApiError(400, "Blog not found");

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            blog[0],
            "Blog fetched successfully"
        )
    )
})

export {
    getAllBlogs,
    publishABlog,
    deleteABlog,
    updateABlog,
    getABlog
}