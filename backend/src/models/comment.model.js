import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        game: {
            type: Schema.Types.ObjectId,
            ref: "Game",
        },
        blog: {
            type: Schema.Types.ObjectId,
            ref: "Blog",
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    },
    {
        timestamps: true
    }
)

commentSchema.plugin(mongooseAggregatePaginate);
export const Comment = mongoose.model("Comment", commentSchema);