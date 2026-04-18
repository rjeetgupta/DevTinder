import { Router } from "express";

import verifyJWT from "../middlewares/auth.middleware";
import {
    createPayment,
    handleWebhook,
    verifyPremium
} from "../controllers/payment.controller";

const router: Router = Router();

router.route("/payment/create").post(verifyJWT, createPayment);
router.route("/payment/webhook").post(handleWebhook);
router.route("/payment/premium/verify").post(verifyJWT, verifyPremium);

export default router;