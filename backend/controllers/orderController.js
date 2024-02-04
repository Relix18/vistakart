import { Order } from "../models/orderModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Product } from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";

export const newOrder = catchAsyncError(async (req, res, next) => {
  const { shippingInfo, items, paymentMethod, paymentId, totalItems, total } =
    req.body;

  let paymentStatus = "pending";

  if (paymentMethod === "online") {
    paymentStatus = "Paid";
  }

  const order = await Order.create({
    shippingInfo,
    items,
    paymentMethod,
    paymentId,
    paymentStatus,
    totalItems,
    total,
    user: req.user._id,
  });

  await sendEmail({
    email: req.user.email,
    subject: "Order Placed",
    message: `Your order has been placed successfully. Your order number is ${order._id}.`,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// get single Order
export const getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user orders
export const myOrders = catchAsyncError(async (req, res, next) => {
  let orders = await Order.find({ user: req.user._id });

  orders = orders.reverse();

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders --Admin
export const allOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status --Admin
export const updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already deliverd this order", 404));
  }

  if (req.body.status === "Shipped") {
    order.items.forEach(async (order) => {
      await updateStock(order.product, order.quantity);
    });
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
    order.paymentStatus = "Paid";
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete order --Admin

export const deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
});
