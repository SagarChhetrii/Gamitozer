import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

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

subscriptionModel.plugin(aggregatePaginate)

export const Subscription = mongoose.model("Subscription", subscriptionModel);