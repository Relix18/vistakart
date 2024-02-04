import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./product/productSlice.js";
import cartReducer from "./cart/cartSlice.js";
import orderReducer from "./order/orderSlice.js";
import userReducer from "./user/userSlice.js";

const store = configureStore({
  reducer: {
    product: productsReducer,
    cart: cartReducer,
    order: orderReducer,
    user: userReducer,
  },
});

export default store;
