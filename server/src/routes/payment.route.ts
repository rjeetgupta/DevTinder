import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware";
import {
    createPayment,
    handleWebhook,
    verifyPremium
} from "../controllers/payment.controller";

const router: Router = Router();

router.route("/create").post(verifyJWT, createPayment);
router.route("/webhook").post(handleWebhook);
router.route("/premium/verify").post(verifyJWT, verifyPremium);

export default router;