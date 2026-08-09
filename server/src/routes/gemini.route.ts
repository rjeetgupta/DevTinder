import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { tokenBucketLimiter } from "../middlewares/rateLimiter.middleware.js";
import { suggestCourses } from "../controllers/gemini.controller.js";

const router: Router = Router();

// 5 requests burst, refilling 1 every 10s
const aiRateLimiter = tokenBucketLimiter(5, 0.1);

router.route("/suggest-courses").post(verifyJWT, aiRateLimiter, suggestCourses);

export default router;
