import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    registerSchema,
    loginSchema,
    changePasswordSchema,
    updateProfileSchema,
} from "../validators/user.validation.js";
import { changeUserPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserDetails } from "../controllers/user.controller.js";

const router: Router = Router();

// Public routes
router.route("/register").post(
    validate(registerSchema),
    registerUser
);

router.route("/login").post(
    validate(loginSchema),
    loginUser
);

router.route("/refresh-token").post(
    refreshAccessToken
);

// Protected routes
router.route("/logout").post(
    verifyJWT,
    logoutUser
);

router.route("/profile").get(
    verifyJWT,
    getCurrentUser
);

router.route("/change-password").patch(
    verifyJWT,
    validate(changePasswordSchema),
    changeUserPassword
);

router.route("/update-profile").patch(
    verifyJWT,
    validate(updateProfileSchema),
    updateUserDetails
);

export default router;