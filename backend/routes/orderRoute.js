import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  updateOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router
  .route("/order/me")
  .post(isAuthenticated, newOrder)
  .get(isAuthenticated, myOrders);

router.get("/order/:id", isAuthenticated, getSingleOrder);
router.get("/admin/orders", isAuthenticated, isAuthorized, allOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticated, isAuthorized, updateOrder)
  .delete(isAuthenticated, isAuthorized, deleteOrder);

export default router;
