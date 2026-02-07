import {Schema} from "mongoose";

const blogSchema = new Schema(
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
            ref: "Game"
        }
    },
    {
        timestamps: true
    }
)