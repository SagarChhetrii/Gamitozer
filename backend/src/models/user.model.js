import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

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
            unique: true,
            trim: true,
            lowercase: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String, //Cloudinary link
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

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrectasync =  async function (password) {
    return await bcrypt.compare(password, this.password);
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