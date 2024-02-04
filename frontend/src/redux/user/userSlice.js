import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  logInUser,
  createUser,
  signOut,
  fetchLoggedInUser,
  updateUser,
  fetchUserAddress,
  updateUserAddress,
  deleteUserAddress,
  addUserAddress,
  allUsers,
  deleteUser,
  updateUserRole,
  fetchUserById,
  ChangePassword,
  forgotPassword,
  resetPassword,
  contactUs,
} from "./userAPI.js";

const initialState = {
  user: null,
  userRole: null,
  users: [],
  userOrders: [],
  userAddress: [],
  checked: false,
  isAuthenticated: false,
  status: "idle",
  success: false,
  error: null,
};

export const fetchLoggedInUserAsync = createAsyncThunk(
  "user/fetchLoggedInUser",
  async () => {
    const { data } = await fetchLoggedInUser();
    return data.user;
  }
);

export const createUserAsync = createAsyncThunk(
  "user/createUser",

  async (user, { rejectWithValue }) => {
    try {
      const response = await createUser(user);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOutAsync = createAsyncThunk("user/signOut", async (user) => {
  const response = await signOut(user);
  return response.data;
});

export const logInUserAsync = createAsyncThunk(
  "user/checkUser",
  async (loginInfo, { rejectWithValue }) => {
    try {
      const response = await logInUser(loginInfo);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  "user/updateUser",
  async (update) => {
    const response = await updateUser(update);
    return response.data;
  }
);

export const fetchUserAddressAsync = createAsyncThunk(
  "user/fetchUserAddress",
  async () => {
    const { data } = await fetchUserAddress();
    return data.addresses;
  }
);

export const addUserAddressAsync = createAsyncThunk(
  "user/addUserAddress",
  async (address) => {
    const { data } = await addUserAddress(address);
    return data.addresses;
  }
);

export const updateUserAddressAsync = createAsyncThunk(
  "user/updateUserAddress",
  async (update) => {
    const { data } = await updateUserAddress(update);
    return data.addresses;
  }
);

export const deleteUserAddressAsync = createAsyncThunk(
  "user/deleteUserAddress",
  async (id) => {
    const { data } = await deleteUserAddress(id);
    return data.addresses;
  }
);

export const getAllUserAsync = createAsyncThunk("user/getAllUser", async () => {
  const { data } = await allUsers();
  return data.users;
});

export const deleteUserAsync = createAsyncThunk(
  "user/deleteUser",
  async (id) => {
    const { data } = await deleteUser(id);
    return data;
  }
);

export const updateUserRoleAsync = createAsyncThunk(
  "user/updateUserRole",
  async (id) => {
    const { data } = await updateUserRole(id);
    return data;
  }
);

export const fetchUserByIdAsync = createAsyncThunk(
  "user/fetchUserById",
  async (id) => {
    const { data } = await fetchUserById(id);
    return data.user;
  }
);

export const changePasswordAsync = createAsyncThunk(
  "user/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ChangePassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const forgotPasswordAsync = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await forgotPassword(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  "user/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await resetPassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const contactUsAsync = createAsyncThunk(
  "user/contactUs",
  async (data, { rejectWithValue }) => {
    try {
      const response = await contactUs(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      return { ...state, error: null, success: false };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoggedInUserAsync.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchLoggedInUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.checked = true;
      })
      .addCase(fetchLoggedInUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
        state.loading = false;
        state.checked = true;
      })
      .addCase(createUserAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.isAuthenticated = true;
        state.user = action.payload;
        state.checked = true;
        state.success = true;
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
        state.checked = true;
      })
      .addCase(signOutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signOutAsync.fulfilled, (state) => {
        state.status = "idle";
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logInUserAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logInUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.isAuthenticated = true;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(logInUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })

      .addCase(updateUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.isAuthenticated = true;
        state.user = action.payload;
      })

      .addCase(addUserAddressAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addUserAddressAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userAddress = action.payload;
      })
      .addCase(fetchUserAddressAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserAddressAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userAddress = action.payload;
      })
      .addCase(updateUserAddressAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserAddressAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userAddress = action.payload;
      })
      .addCase(deleteUserAddressAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUserAddressAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userAddress = action.payload;
      })
      .addCase(getAllUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.users = action.payload;
      })
      .addCase(deleteUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.users = state.users.filter(
          (user) => user._id !== action.payload._id
        );
      })
      .addCase(updateUserRoleAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserRoleAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.users = state.users.map((user) => {
          if (user._id === action.payload._id) {
            return action.payload;
          }
          return user;
        });
      })
      .addCase(fetchUserByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userRole = action.payload;
      })
      .addCase(changePasswordAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(changePasswordAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload;
        state.success = true;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(forgotPasswordAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(forgotPasswordAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.success = true;
      })
      .addCase(forgotPasswordAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(resetPasswordAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPasswordAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.success = true;
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      .addCase(contactUsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(contactUsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.success = true;
      })
      .addCase(contactUsAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;

export const selectUserInfo = (state) => state.user.user;
export const authenticated = (state) => state.user.isAuthenticated;
export const selectUserAddress = (state) => state.user.userAddress;
export const userStatus = (state) => state.user.status;
export const selectAllUsers = (state) => state.user.users;
export const selectUserRole = (state) => state.user.userRole;

export default userSlice.reducer;
