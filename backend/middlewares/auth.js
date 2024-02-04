import { User } from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource.", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

export const isAuthorized = (req, res, next) => {
  if (req.user.role === "user") {
    return next(
      new ErrorHandler(
        `Role: ${req.user.role} is not allowed to access this resourse`,
        403
      )
    );
  }

  next();
};
