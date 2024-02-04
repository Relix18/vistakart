import express from "express";
import {
  checkout,
  paymentVerification,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/payment/process", checkout);
router.post("/paymentverification", paymentVerification);

export default router;
