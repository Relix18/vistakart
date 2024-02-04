import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Product } from "../models/productModel.js";
import { Cart } from "../models/cartModel.js";
import ErrorHandler from "../utils/errorHandler.js";

//Add items to Cart
export const addItemToCart = catchAsyncError(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const items = {
    user: req.user._id,
    product: productId,
    quantity,
  };

  const sameProduct = await Cart.findOne({
    product: productId,
    user: req.user._id,
  });

  if (sameProduct) {
    return next(new ErrorHandler("Product Already Added", 409));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  const cart = new Cart(items);

  const expandedCart = await cart.save();

  const carts = await expandedCart.populate("product");

  res.status(200).json({
    success: true,
    carts,
  });
});

//Get Cart Items

export const getCart = catchAsyncError(async (req, res, next) => {
  const cart = await Cart.find({ user: req.user._id }).populate("product");

  if (!cart) {
    return next(new ErrorHandler("Cart is Empty", 404));
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

// Delete Cart Items
export const deleteCart = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const cart = await Cart.findById(id);

  if (!cart) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  await cart.deleteOne();

  res.status(200).json({
    success: true,
  });
});

//Update Cart

export const updateCart = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const item = await Cart.findByIdAndUpdate(
    id,
    { quantity },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  const cart = await item.populate("product");

  res.status(200).json({
    success: true,
    cart,
  });
});
