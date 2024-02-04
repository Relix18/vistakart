import express from "express";
import {
  addItemToCart,
  deleteCart,
  getCart,
  updateCart,
} from "../controllers/cartController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/cart", isAuthenticated, addItemToCart);
router.get("/cart", isAuthenticated, getCart);
router.delete("/cart/:id", isAuthenticated, deleteCart);
router.put("/cart/:id", isAuthenticated, updateCart);

export default router;
