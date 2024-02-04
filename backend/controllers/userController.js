import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Address, User } from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";

//Register a User
export const register = catchAsyncError(async (req, res, next) => {
  const avatar = req.body.avatar;

  if (avatar !== undefined) {
    let myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    sendToken(user, 201, res);
  } else {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
    });
    sendToken(user, 201, res);
  }
});

// Login User

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

//Logout User

export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

//Forgot Password

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${process.env.CLIENT_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Tasmay Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// get user details

export const getUserDetails = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;

  let user = await User.findById(id);

  return res.status(200).json({
    success: true,
    user,
  });
});

//update user password

export const updateUserPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  const message = `Your VistaKart account password has been successfully updated.`;

  await sendEmail({
    email: user.email,
    subject: "Tasmay Password Change",
    message,
  });

  await user.save();
  sendToken(user, 200, res);
});

// update User Profile

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const avatar = req.body.avatar;

  if (avatar !== undefined) {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
    });

    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    };

    await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  } else {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  }
});

// Get all user

export const getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user details (Admin)

export const singleUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with id: ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role

export const updateRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete user --Admin
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
});

// Add Address
export const addAddress = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, city, street, state, zip } = req.body;

  const address = {
    name,
    email,
    phone,
    city,
    street,
    state,
    zip,
  };

  await Address.create({ address, user: req.user._id });

  res.status(200).json({
    success: true,
  });
});

// Get Address
export const getAddress = catchAsyncError(async (req, res, next) => {
  const addresses = await Address.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    addresses,
  });
});

// Update Address
export const updateAddress = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { address } = req.body;

  const isExist = await Address.findById(id);

  if (!isExist) {
    return next(
      new ErrorHandler(`Address does not exist with Id: ${req.params.id}`, 400)
    );
  }

  if (
    !address.name ||
    !address.email ||
    !address.phone ||
    !address.city ||
    !address.street ||
    !address.state ||
    !address.zip
  ) {
    return next(
      new ErrorHandler("Please enter all fields to update your address", 400)
    );
  }

  await Address.findByIdAndUpdate(
    id,
    { address },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

// Delete Address

export const deleteAddress = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const isExist = await Address.findById(id);

  if (!isExist) {
    return next(
      new ErrorHandler(`Address does not exist with Id: ${req.params.id}`, 400)
    );
  }

  await Address.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
  });
});

// Contact Us

export const contactUs = catchAsyncError(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  sendEmail({
    email: process.env.SMTP_MAIL,
    subject: "VistaKart Contact Us",
    message: `Name: ${name} \n Email: ${email} \n Message: ${message}`,
  });

  res.status(200).json({
    success: true,
    message: "Mail sent successfully",
  });
});
