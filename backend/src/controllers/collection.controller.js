import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Collection } from "../models/collection.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getUserCollections = asyncHandler( async (req, res) => {
    const { userId } = req.params;
    
})

const publishACollection = asyncHandler( async (req, res) => {
    const {name, description, visibility = "public"} = req.body || {};

    if(!name?.trim()) throw new ApiError(400, "Collection name is required");

    const collection = await Collection.create({
        name: name.trim(),
        description: description.trim(),
        visibility: visibility.trim(),
        owner: req.user?._id,
        games: []
    })

    if(!collection) throw new ApiError(500, "Something went wrong while creating the collection");

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            collection,
            "Collection published successfully"
        )
    )
})

export {
    publishACollection
}