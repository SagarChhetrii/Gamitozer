import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleGameLike = asyncHandler( async (req, res) => {
    const {gameId} = req.params;

    if(!gameId?.trim()) throw new ApiError(400, "Game is is required");

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