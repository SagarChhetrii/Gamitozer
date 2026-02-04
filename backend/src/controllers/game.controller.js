import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Game } from "../models/game.model.js";

const getAllGames = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, searchQuery, tags, sortBy, sortType } = req.query;

    const pipeline = [
        {
            $match: {
                visibility: "Public"
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


export {
    getAllGames
}