import express from "express";
import {
  createProduct,
  createProductBrand,
  createProductCategory,
  createReview,
  deleteBanner,
  deleteProduct,
  deleteReview,
  getAdminProducts,
  getAllProducts,
  getBanner,
  getProductBrand,
  getProductCategory,
  getProductDetails,
  getProductReviews,
  updateProduct,
  uploadBanner,
} from "../controllers/productController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/admin/new", isAuthenticated, isAuthorized, createProduct);
router.get("/all", getAllProducts);
router.get("/category", getProductCategory);
router.get("/brand", getProductBrand);
router.get("/banner", getBanner);

router.get("/admin/products", isAuthenticated, isAuthorized, getAdminProducts);
router
  .route("/admin/:id")
  .put(isAuthenticated, isAuthorized, updateProduct)
  .delete(isAuthenticated, isAuthorized, deleteProduct);

router.get("/:id", getProductDetails);

router.put("/review", isAuthenticated, createReview);
router.delete("/reviews", isAuthenticated, deleteReview);
router.get("/review/all", isAuthenticated, getProductReviews);
router.post("/brand/new", isAuthenticated, isAuthorized, createProductBrand);
router.post(
  "/category/new",
  isAuthenticated,
  isAuthorized,
  createProductCategory
);

router.post("/banner/upload", isAuthenticated, isAuthorized, uploadBanner);
router.delete("/banner/:id", isAuthenticated, isAuthorized, deleteBanner);

export default router;
