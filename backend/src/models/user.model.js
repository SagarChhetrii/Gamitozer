import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String, //Cloudinary link
            required: true
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            required: true
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

userSchema.plugin(aggregatePaginate);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    
    
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password.trim(), this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME
        }
    )
}

export const User = mongoose.model("User", userSchema);