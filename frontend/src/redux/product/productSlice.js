import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchProductsBrand,
  fetchProductsCategory,
  fetchProductById,
  fetchProducts,
  fetchBanners,
  productReview,
  fetchAdminProducts,
  createProductCategory,
  deleteProduct,
  createProductBrand,
  createProduct,
  deleteBanner,
  addBanner,
  updateProduct,
  deleteReview,
  getAllReview,
} from "./productAPI.js";

const initialState = {
  products: [],
  adminProducts: [],
  categories: [],
  brands: [],
  reviews: [],
  banners: [],
  status: "idle",
  selectedProduct: [],
};

export const productAsync = createAsyncThunk(
  "products/fetchProduct",
  async (filter) => {
    const { data } = await fetchProducts(filter);
    return data;
  }
);

export const createProductAsync = createAsyncThunk(
  "products/createProduct",
  async (product) => {
    const { data } = await createProduct(product);
    return data.product;
  }
);

export const updateProductAsync = createAsyncThunk(
  "products/updateProduct",
  async (product) => {
    const { data } = await updateProduct(product);
    return data;
  }
);

export const deleteBannerAsync = createAsyncThunk(
  "products/deleteBanner",
  async (id) => {
    const { data } = await deleteBanner(id);
    return data;
  }
);

export const addBannerAsync = createAsyncThunk(
  "products/addBanner",
  async (banner) => {
    const { data } = await addBanner(banner);
    return data;
  }
);

export const adminProductAsync = createAsyncThunk(
  "products/fetchAdminProduct",
  async () => {
    const { data } = await fetchAdminProducts();
    return data.products;
  }
);

export const productByIdAsync = createAsyncThunk(
  "products/fetchProductById",
  async (id) => {
    const { data } = await fetchProductById(id);
    return data;
  }
);
export const productsBrandAsync = createAsyncThunk(
  "products/fetchProductsBrand",
  async () => {
    const response = await fetchProductsBrand();
    return response.data;
  }
);

export const createBrandAsync = createAsyncThunk(
  "products/createBrand",
  async (label) => {
    const { data } = await createProductBrand(label);
    return data.brands;
  }
);

export const productsCategoryAsync = createAsyncThunk(
  "products/fetchProductsCategory",
  async () => {
    const response = await fetchProductsCategory();
    return response.data;
  }
);

export const createCategoryAsync = createAsyncThunk(
  "products/createCategory",
  async (label) => {
    const { data } = await createProductCategory(label);
    return data.categories;
  }
);

export const bannerAsync = createAsyncThunk(
  "products/fetchBanner",
  async () => {
    const response = await fetchBanners();
    return response.data;
  }
);

export const productReviewAsync = createAsyncThunk(
  "products/review",
  async (review) => {
    const { data } = await productReview(review);
    return data.review;
  }
);

export const deleteProductAsync = createAsyncThunk(
  "products/deleteProduct",
  async (id) => {
    const { data } = await deleteProduct(id);
    return data;
  }
);

export const getAllReviewAsync = createAsyncThunk(
  "products/getAllReview",
  async (id) => {
    const { data } = await getAllReview(id);
    return data.reviews;
  }
);

export const deleteReviewAsync = createAsyncThunk(
  "products/deleteReview",
  async (review) => {
    const { data } = await deleteReview(review);
    return data;
  }
);

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(productAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(productAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload;
      })
      .addCase(createProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products.push(action.payload);
      })
      .addCase(updateProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = state.products.map((product) => {
          if (product._id === action.payload.id) {
            return action.payload;
          }
          return product;
        });
      })
      .addCase(deleteProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(adminProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(adminProductAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.adminProducts = action.payload;
      })
      .addCase(productByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(productByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedProduct = action.payload;
      })
      .addCase(productsBrandAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(productsBrandAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.brands = action.payload;
      })
      .addCase(createBrandAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createBrandAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.brands.brands.push(action.payload);
      })
      .addCase(productsCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(productsCategoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.categories = action.payload;
      })
      .addCase(createCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.categories.categories.push(action.payload);
      })
      .addCase(bannerAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(bannerAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.banners = action.payload;
      })
      .addCase(deleteBannerAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBannerAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.banners = state.banners.banners.filter(
          (banner) => banner._id !== action.payload
        );
      })
      .addCase(addBannerAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addBannerAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.banners.banners.push(action.payload);
      })
      .addCase(productReviewAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(productReviewAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedProduct.product.review = [action.payload];
      })
      .addCase(getAllReviewAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllReviewAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.reviews = action.payload;
      })
      .addCase(getAllReviewAsync.rejected, (state) => {
        state.status = "idle";
        state.reviews = [];
      })
      .addCase(deleteReviewAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteReviewAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload
        );
      });
  },
});

export const selectAllProducts = (state) => state.product.products;
export const selectProductById = (state) => state.product.selectedProduct;
export const selectBrands = (state) => state.product.brands;
export const selectCategories = (state) => state.product.categories;
export const productStatus = (state) => state.product.status;
export const selectBanner = (state) => state.product.banners;
export const selectAdminProducts = (state) => state.product.adminProducts;
export const selectReviews = (state) => state.product.reviews;

export default productsSlice.reducer;
