import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { getProfile, editProfile } from "../controllers/profile.controller.js";

const router: Router = Router();

router.route("/profile/view").get(verifyJWT, getProfile);
router.route("/profile/edit").post(verifyJWT, upload.single("photo"), editProfile);

export default router;
