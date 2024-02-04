import mongoose, { Schema, mongo } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      type: Schema.Types.Mixed,
      required: true,
    },
    items: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "online"],
    },
    paymentStatus: {
      type: String,
      required: true,
      default: "pending",
    },
    paymentId: {
      type: String,
      default: null,
    },
    total: {
      type: Number,
      default: 0,
    },
    totalItems: {
      type: Number,
      default: 1,
    },
    orderStatus: {
      type: String,
      required: true,
      default: "Processing",
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
