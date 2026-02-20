import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const likeSchema = new Schema(
    {
        game: {
            type: Schema.Types.ObjectId,
            ref: "Game"
        },
        blog: {
            type: Schema.Types.ObjectId,
            ref: "Blog"
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {
        timestamps: true
    }
)

likeSchema.plugin(mongooseAggregatePaginate)

export const Like = mongoose.model("Like", likeSchema)