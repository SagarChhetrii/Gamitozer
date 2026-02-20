import mongoose, { Schema } from "mongoose";


const subscriptionModel = new Schema(
    {
        follower: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        developer: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

export const Subscription = mongoose.model("Subscription", subscriptionModel);