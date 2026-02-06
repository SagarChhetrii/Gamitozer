import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const gameSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        link: {
            type: String,
            required: true,
            trim: true
        },
        banner: {
            type: String, //Cloudinary Url
            required: true
        },
        video: {
            type: String //Cloudinary Url
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "public"
        },
        tags: [
            {
                type: String,
            }
        ]
    },
    {
        timestamps: true
    }
)

gameSchema.plugin(mongooseAggregatePaginate)

export const Game = mongoose.model("Game", gameSchema)