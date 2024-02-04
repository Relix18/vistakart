import express from "express";
import {
  addAddress,
  contactUs,
  deleteAddress,
  deleteUser,
  forgotPassword,
  getAddress,
  getAllUser,
  getUserDetails,
  login,
  logout,
  register,
  resetPassword,
  singleUserDetails,
  updateAddress,
  updateProfile,
  updateRole,
  updateUserPassword,
} from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/me", isAuthenticated, getUserDetails);
router.put("/password/update", isAuthenticated, updateUserPassword);
router.put("/profile/update", isAuthenticated, updateProfile);
router.get("/admin/users", isAuthenticated, isAuthorized, getAllUser);
router
  .route("/admin/user/:id")
  .get(isAuthenticated, isAuthorized, singleUserDetails)
  .put(isAuthenticated, isAuthorized, updateRole)
  .delete(isAuthenticated, isAuthorized, deleteUser);
router.get("/logout", logout);
router.post("/address", isAuthenticated, addAddress);
router.get("/address", isAuthenticated, getAddress);
router.put("/address/:id", isAuthenticated, updateAddress);
router.delete("/address/:id", isAuthenticated, deleteAddress);
router.post("/contact", contactUs);

export default router;
