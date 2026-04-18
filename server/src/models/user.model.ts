import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../types/user.types";


const userSchema: Schema<IUser> = new Schema(
    {
        /* ---------- Basic Info ---------- */
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },

        lastName: {
            type: String,
            trim: true,
            maxlength: 50,
        },

        uniqueId: {
            type: String,
            unique: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: (value: string) => validator.isEmail(value),
                message: "Invalid email address",
            },
        },

        password: {
            type: String,
            required: true,
            validate: {
                validator: (value: string) =>
                    validator.isStrongPassword(value),
                message: "Enter a strong password",
            },
        },

        /* ---------- Auth ---------- */
        emailVerified: {
            type: Boolean,
            default: false
        },
        lastLoginAt: {
            type: Date
        },
        loginAttempts: {
            type: Number,
            default: 0
        },
        lockUntil: {
            type: Date
        },

        /* ---------- Profile ---------- */
        age: {
            type: Number,
            min: 18,
            max: 60
        },

        gender: {
            type: String,
            enum: ["male", "female", "others"],
        },

        bio: {
            type: String,
            maxlength: 3000
        },

        experienceLevel: {
            type: String,
            enum: ["fresher", "junior", "mid", "senior"],
            default: "fresher",
        },

        location: {
            city: { type: String },
            state: { type: String },
            country: { type: String, default: "India" },
        },

        photoUrl: {
            type: String,
            default:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYCZ0qae7TaC6iuCJf6WzgV97HR0rMLm8N5A&s",
            validate: {
                validator: (value: string): boolean => validator.isURL(value),
                message: "Invalid photo URL",
            },
        },

        /* ---------- Skills ---------- */
        skills: {
            type: [String],
            validate: {
                validator: (value: string[]) => value.length <= 25,
                message: "Maximum 25 skills allowed",
            },
        },

        /* ---------- Social Links ---------- */
        githubUrl: {
            type: String,
            trim: true,
            validate: {
                validator: (v: string) => !v || validator.isURL(v),
                message: "Invalid GitHub URL",
            },
        },

        linkedinUrl: {
            type: String,
            trim: true,
            validate: {
                validator: (v: string) => !v || validator.isURL(v),
                message: "Invalid LinkedIn URL",
            },
        },

        twitterUrl: {
            type: String,
            trim: true,
            validate: {
                validator: (v: string) => !v || validator.isURL(v),
                message: "Invalid Twitter URL",
            },
        },

        portfolioUrl: {
            type: String,
            trim: true,
            validate: {
                validator: (v: string) => !v || validator.isURL(v),
                message: "Invalid Portfolio URL",
            },
        },

        /* ---------- App Control ---------- */
        profileCompletion: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        isProfileComplete: {
            type: Boolean,
            default: false
        },
        isBlocked: {
            type: Boolean,
            default: false
        },

        /* ---------- Status ---------- */
        status: {
            type: Number,
            enum: [1, -1],
            default: 1,
            index: true,
        },

        isPremium: { type: Boolean, default: false },

        memberShipType: {
            type: String,
            enum: ["silver", "gold", null],
            default: null,
        },

        resetPasswordToken: {
            type: String,
            default: null
        },
        resetPasswordExpires: {
            type: Date,
            default: null
        },
        refreshToken: {
            type: String,
            select: false,
        },
    },
    { timestamps: true }
);

/* ---------- Indexes ---------- */
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.index({ gender: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ "location.city": 1 });


// Hash password before save
userSchema.pre("save", async function (this: IUser, next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.pre("save", function (this: IUser, next) {
    if (this.isNew || !this.uniqueId) {
        const namePart = this.firstName.toLowerCase().replace(/\s+/g, "");
        const specialChars = "@#$&_";
        const randomSpecial =
            specialChars[Math.floor(Math.random() * specialChars.length)];
        const randomSuffix = Math.random().toString(36).substring(2, 5);

        this.uniqueId = `${namePart}${randomSpecial}${randomSuffix}`;
    }
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (
    this: IUser,
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