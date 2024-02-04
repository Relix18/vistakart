import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addItem,
  deleteItem,
  updateItem,
  fetchItemsByUser,
  resetCart,
} from "./cartAPI.js";

const initialState = {
  items: [],
  errors: null,
  status: "idle",
};

export const itemsByUserIdAsync = createAsyncThunk(
  "cart/fetchItemsByUser",
  async () => {
    const { data } = await fetchItemsByUser();
    return data.cart;
  }
);

export const addAsync = createAsyncThunk("cart/addItems", async (item) => {
  const { data } = await addItem(item);
  return data.carts;
});

export const deleteAsync = createAsyncThunk("cart/deleteItem", async (id) => {
  await deleteItem(id);
  return id;
});
export const updateAsync = createAsyncThunk("cart/updateItem", async (item) => {
  const { data } = await updateItem(item);
  return data.cart;
});

export const resetCartAsync = createAsyncThunk("cart/resetCart", async () => {
  const response = await resetCart();
  return response.data;
});

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(itemsByUserIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(itemsByUserIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(addAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.items.push(action.payload);
      })
      .addCase(resetCartAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetCartAsync.fulfilled, (state) => {
        state.status = "idle";
        state.items = [];
      })
      .addCase(deleteAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.items.findIndex(
          (item) => item.id === action.payload
        );
        state.items.splice(index, 1);
      })
      .addCase(updateAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.items.findIndex(
          (item) => item.id === action.payload._id
        );
        state.items[index] = action.payload;
      })
      .addCase(updateAsync.rejected, (state) => {
        state.status = "idle";
        state.errors = "Something went wrong!";
      });
  },
});

export const selectItems = (state) => state.cart.items;
export const cartStatus = (state) => state.cart.status;

export default cartSlice.reducer;
