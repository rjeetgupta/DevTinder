import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
    signupSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from "../validators/auth.validation.js";
import {
    signupUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
} from "../controllers/auth.controller.js";

const router: Router = Router();

router.route("/register").post(validate(signupSchema), signupUser);
router.route("/login").post(validate(loginSchema), loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/forgot-password").post(validate(forgotPasswordSchema), forgotPassword);
router.route("/reset-password/:token").post(validate(resetPasswordSchema), resetPassword);

export default router;
