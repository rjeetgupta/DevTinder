import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../types/user.types";

const userSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            maxlength: [50, "First name cannot exceed 50 characters"],
        },

        lastName: {
            type: String,
            trim: true,
            maxlength: [50, "Last name cannot exceed 50 characters"],
        },

        email: {
            type: String,
            lowercase: true,
            required: [true, "Email is required"],
            trim: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
        },

        age: {
            type: Number,
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },

        about: {
            type: String,
            default: "Write about yourself",
        },

        city: {
            type: String,
            trim: true,
            maxlength: 100,
        },
         
        photoUrl: {
            type: String,
            default: "https://www.freepik.com/free-vector/user-blue-gradient_145856969.htm#fromView=keyword&page=1&position=0&uuid=f5f902f7-6393-4a0c-9cb2-89684689f6f7&query=User",
        },
          
        dateOfBirth: {
            type: Date,
        },
          
        skills: {
            type: [String],
            default: [],
        },

        refreshToken: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster search
userSchema.index({ firstName: 1, lastName: 1 });

// Hash password before save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (
    password: string
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function (): string {
    return jwt.sign(
        {
            _id: this._id.toString(),
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET! as string,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
        }
    );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign(
        {
            _id: this._id.toString(),
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
        }
    );
};

// Export model
const User = model<IUser>("User", userSchema);
export default User;