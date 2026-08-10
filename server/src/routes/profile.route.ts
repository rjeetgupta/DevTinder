import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { getProfile, editProfile } from "../controllers/profile.controller.js";

const router: Router = Router();

router.route("/").get(verifyJWT, getProfile);
router.route("/update-profile").post(verifyJWT, upload.single("photo"), editProfile);

export default router;
