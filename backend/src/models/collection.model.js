import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        games: [
            {
                type: Schema.Types.ObjectId,
                ref: "Game"
            }
        ],
        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "public"
        }
    },
    {
        timestamps: true
    }
)


export const Collection = mongoose.model("Collection", collectionSchema);