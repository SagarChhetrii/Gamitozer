import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler( async (req, res) => {
    const {developerId} = req.params;

    if(!developerId?.trim()) throw new ApiError(400, "Developer id is required");

    let subscribed = await Subscription.findOne({
        follower: req.user?._id,
        developer: developerId
    })

    if(subscribed) {
        const unsubscribedResponse = await Subscription.deleteOne({
            follower: req.user?._id,
            developer: developerId
        });

        if(!unsubscribedResponse.acknowledged) throw new ApiError(500, "Something went wrong while toggling subscription");
        subscribed = null;
    } else {
        subscribed = await Subscription.create({
            follower: req.user?._id,
            developer: developerId
        })
    }

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            subscribed,
            "Subscription toggled successfully"
        )
    )
})

export {
    toggleSubscription
}