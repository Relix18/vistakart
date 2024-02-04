import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Payment } from "../models/paymentModel.js";
import { instance } from "../index.js";
import crypto from "crypto";

export const checkout = catchAsyncError(async (req, res, next) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
});

export const paymentVerification = catchAsyncError(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (expectedSign === razorpay_signature) {
    await Payment.create({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    res.redirect(
      `${req.protocol}://${process.env.CLIENT_URL}/order-success/${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
});
