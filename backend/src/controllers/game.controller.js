import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Game } from "../models/game.model.js";
import {deleteFromCloudinary, deleteVideoFromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js";

const getAllGames = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, searchQuery, tags, sortBy, sortType } = req.query;

    const pipeline = [
        {
            $match: {
                visibility: "public"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [{
                    $project: {
                        fullname: 1,
                        username: 1,
                        avatar: 1
                    }
                }]
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

    if (searchQuery) {
        pipeline.push(
            {
                $match: {
                    title: {
                        $regex: searchQuery,
                        $options: "i"
                    }
                }
            }
        )
    }

    if (tags) {
        const tagsArray = Array.isArray(tags) ? tags : tags.split(",");
        pipeline.push(
            {
                $match: {
                    tags: {
                        $in: tagsArray
                    }
                }
            }
        )
    }

    if (sortBy) {
        const sort = {}
        sort[sortBy] = sortType === "asc" ? 1 : -1;;
        pipeline.push({ $sort: sort })
    }

    const paginateOptions = {
        page,
        limit,
        customLabels: {
            docs: "games",
            totalDocs: "totalGames",
        }
    }

    const games = await Game.aggregatePaginate(Game.aggregate(pipeline), paginateOptions);

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                games,
                "Fetched games successfully"
            )
        )
})

const publishAGame = asyncHandler( async (req, res) => {
    const {title, description, link, visibility = "public", tags} = req.body || {};

    if(!title?.trim() || !link?.trim()) throw new ApiError(400, "Required fields are needed");
    let tagsArray = [];
    if(tags) {
        tagsArray = tags.split(",");
    }

    const bannerLocalPath = req.files?.bannerFile[0].path;
    const videoLocalPath = req.files?.videoFile?.[0]?.path ?? "";

    if(!bannerLocalPath) throw new ApiError(400, "Banner is required");

    const banner = await uploadOnCloudinary(bannerLocalPath);
    let video = "";
    if(videoLocalPath) {
        video = await uploadOnCloudinary(videoLocalPath);
    }

    const uploadedGame = await Game.create({
        title,
        description,
        link,
        visibility,
        tags: tagsArray,
        owner: req.user?._id,
        banner: banner?.secure_url,
        video: video ? video.secure_url : ""
    });

    if(!uploadedGame) throw new ApiError(500, "Something went wrong while creating game in DB");

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            uploadedGame,
            "Game published successfully"
        )
    )
})

const deleteAGame = asyncHandler( async (req, res) => {
    const {gameId} = req.params;

    if(!gameId) throw new ApiError(400, "Game id is required");

    const game = await Game.findById(gameId);

    if(!game) throw new ApiError(400, "No game found");
    if(!game.owner.equals(req.user?._id)) throw new ApiError(401, "Unauthorized Action");
    
    const banner = game.banner;
    const video = game.video;

    const deletedGameResponse = await Game.deleteOne({ _id: game._id });

    if(!deletedGameResponse.acknowledged) throw new ApiError(500, "Something went wrong while deleting the game");

    if(video) {
        const deletedVideoResponse = await deleteVideoFromCloudinary(video);
        if(!deletedVideoResponse) console.log("Something went wrong while deleting the video from cloudinary");
    }
    const deletedBannerResponse = await deleteFromCloudinary(banner);
    if(!deletedBannerResponse) console.log("Something went wrong while deleting the banner from cloudinary");

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "Game deleted successfully"
        )
    )
})

const updateGameDetails = asyncHandler( async (req, res) => {
    const {gameId} = req.params;

    if(!gameId) throw new ApiError(400, "Game id is required");

    const {title, description, link, tags} = req.body || {};
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const bannerLocalPath = req.files?.bannerFile?.[0]?.path;
    console.log([title, description, link, tags, videoLocalPath, bannerLocalPath].some((field) => field && field?.trim() !== ""))

    if([title, description, link, tags, videoLocalPath, bannerLocalPath].some((field) => field?.trim() !== "" && field)) {
        throw new ApiError(400, "Atleast one field is required");
    }

    const game = await Game.findById(gameId);

    if(!game) throw new ApiError(400, "No game found");
    if(!game.owner.equals(req.user?._id)) throw new ApiError(401, "Unauthorized actions");

    if(title) game.title = title;
    if(description) game.description = description;
    if(link) game.link = link;
    if(tags) {
        const tagsArray = tags.split(","); 
        game.tags = [...new Set([...game.tags, ...tagsArray])];
    }
    if(videoLocalPath) {
        const video = await uploadOnCloudinary(videoLocalPath);
        game.video = video.secure_url;
    } else {
        const videoUrl = game.video;
        const deletedVideoResponse = await deleteVideoFromCloudinary(videoUrl);
        if(!deletedVideoResponse) console.log("Something went wrong while deleting video from cloudinary");
        
        game.video = "";
    }
    if(bannerLocalPath) {
        const banner = await uploadOnCloudinary(bannerLocalPath);
        game.banner = banner.secure_url;
    }

    await game.save({validateBeforeSave: false});

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            game,
            "Game details updated successfully"
        )
    )
})


export {
    getAllGames,
    publishAGame,
    deleteAGame,
    updateGameDetails
}