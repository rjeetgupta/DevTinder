import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../types/user.types.js";

const userSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: [2, "First name must be at least 2 characters"],
            maxlength: [50, "First name cannot exceed 50 characters"],
        },

        lastName: {
            type: String,
            trim: true,
            maxlength: [50, "Last name cannot exceed 50 characters"],
        },

        // Auto-generated, human-friendly public handle (see pre-save hook below)
        uniqueId: {
            type: String,
            unique: true,
            trim: true,
        },

        emailId: {
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
        },

        // ---------- Auth & security ----------
        emailVerified: {
            type: Boolean,
            default: false,
        },
        lastLoginAt: {
            type: Date,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: {
            type: Date,
        },

        // ---------- Profile ----------
        age: {
            type: Number,
            min: 18,
            max: 60,
        },
        gender: {
            type: String,
            enum: ["male", "female", "others"],
        },
        bio: {
            type: String,
            maxlength: 3000,
        },
        experienceLevel: {
            type: String,
            enum: ["fresher", "junior", "mid", "senior"],
            default: "fresher",
        },
        location: {
            state: { type: String },
            country: { type: String, default: "India" },
        },
        photo: {
            type: String,
            default:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYCZ0qae7TaC6iuCJf6WzgV97HR0rMLm8N5A&s",
            validate: {
                validator: (value: string) => !value || validator.isURL(value),
                message: "Invalid photo URL",
            },
        },
        skills: {
            type: [String],
            default: [],
            validate: {
                validator: (value: string[]) => value.length <= 25,
                message: "Maximum 25 skills allowed",
            },
        },

        // ---------- Social links ----------
        githubUrl: {
            type: String,
            trim: true,
            validate: {
                validator: (value: string) => !value || validator.isURL(value),
                message: "Invalid GitHub URL",
            },
        },
        linkedinUrl: {
            type: String,
            trim: true,
            validate: {
                validator: (value: string) => !value || validator.isURL(value),
                message: "Invalid LinkedIn URL",
            },
        },
        twitterUrl: {
            type: String,
            trim: true,
            validate: {
                validator: (value: string) => !value || validator.isURL(value),
                message: "Invalid Twitter URL",
            },
        },
        portfolioUrl: {
            type: String,
            trim: true,
            validate: {
                validator: (value: string) => !value || validator.isURL(value),
                message: "Invalid Portfolio URL",
            },
        },

        // ---------- App control ----------
        profileCompletion: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        isProfileComplete: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        status: {
            type: Number,
            enum: [1, -1],
            default: 1,
            index: true,
        },

        // ---------- Membership ----------
        isPremium: {
            type: Boolean,
            default: false,
        },
        memberShipType: {
            type: String,
            default: null,
        },
        membershipValidTill: {
            type: Date,
            default: null,
        },

        // ---------- Password reset ----------
        resetPasswordToken: {
            type: String,
            default: null,
            select: false,
        },
        resetPasswordExpires: {
            type: Date,
            default: null,
            select: false,
        },
    },
    { timestamps: true }
);

// ---------- Indexes ----------
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.index({ gender: 1 });
userSchema.index({ skills: 1 });

// ---------- Auto-generate a friendly uniqueId ----------
userSchema.pre("save", function (this: IUser, next) {
    if (this.isNew || !this.uniqueId) {
        const namePart = this.firstName.toLowerCase().replace(/\s+/g, "");
        const specialChars = "@#$&_";
        const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)];
        const randomSuffix = Math.random().toString(36).substring(2, 5);
        this.uniqueId = `${namePart}${randomSpecial}${randomSuffix}`;
    }
    next();
});

// ---------- Hash password before save ----------
userSchema.pre("save", async function (this: IUser, next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ---------- Instance methods ----------
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function (): string {
    return jwt.sign(
        { _id: this._id.toString(), emailId: this.emailId },
        process.env.JWT_SECRET,
        { expiresIn: (process.env.JWT_EXPIRY || "1d") as jwt.SignOptions["expiresIn"] }
    );
};

const User = model<IUser>("User", userSchema);
export default User;
