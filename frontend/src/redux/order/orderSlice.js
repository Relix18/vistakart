import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  allOrders,
  deleteOrder,
  fetchCreateOrder,
  fetchOrderById,
  fetchOrdersByUser,
  updateOrder,
} from "./orderAPI.js";

const initialState = {
  orders: [],
  allOrders: [],
  order: null,
  status: "idle",
  orderPlaced: null,
};

export const createOrderAsync = createAsyncThunk(
  "order/createOrder",
  async (order) => {
    const { data } = await fetchCreateOrder(order);
    return data.order;
  }
);

export const fetchOrdersByUserAsync = createAsyncThunk(
  "order/fetchOrdersByUser",
  async () => {
    const { data } = await fetchOrdersByUser();
    return data.orders;
  }
);

export const fetchOrderByIdAsync = createAsyncThunk(
  "order/fetchOrderById",
  async (id) => {
    const { data } = await fetchOrderById(id);
    return data.order;
  }
);

export const allOrdersAsync = createAsyncThunk("order/allOrders", async () => {
  const { data } = await allOrders();
  return data.orders;
});

export const deleteOrderAsync = createAsyncThunk(
  "order/deleteOrder",
  async (id) => {
    const { data } = await deleteOrder(id);
    return data;
  }
);

export const updateOrderAsync = createAsyncThunk(
  "order/updateOrder",
  async (order) => {
    const { data } = await updateOrder(order);
    return data;
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderPlaced = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.orders.push(action.payload);
        state.orderPlaced = action.payload;
      })
      .addCase(fetchOrdersByUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrdersByUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.orders = action.payload;
      })
      .addCase(fetchOrderByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrderByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.order = action.payload;
      })
      .addCase(allOrdersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(allOrdersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.allOrders = action.payload;
      })
      .addCase(deleteOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.allOrders = state.allOrders.filter(
          (order) => order._id !== action.payload._id
        );
      })
      .addCase(updateOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.orders = state.orders.map((order) => {
          if (order._id === action.payload._id) {
            return action.payload;
          }
          return order;
        });
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export const selectOrders = (state) => state.order.orders;
export const selectOrderPlaced = (state) => state.order.orderPlaced;
export const selectOrderById = (state) => state.order.order;
export const orderStatus = (state) => state.order.status;
export const selectAllOrders = (state) => state.order.allOrders;

export default orderSlice.reducer;
