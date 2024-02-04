import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
};

const link = "http://localhost:4000";

export function fetchProducts({ filter, currentPage = 1, search = "" }) {
  let queryString = "";
  for (let key in filter) {
    const categoryValues = filter[key];
    if (categoryValues.length > 0) {
      queryString += `${key}=${categoryValues}&`;
    }
  }
  return axios.get(
    `/api/v1/product/all?page=${currentPage}&${queryString}&keyword=${search}`
  );
}

export function createProduct(product) {
  try {
    const response = axios.post(`/api/v1/product/admin/new`, product, config);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const updateProduct = (data) => {
  try {
    const response = axios.put(
      `/api/v1/product/admin/${data.id}`,
      data.product,
      config
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export function fetchAdminProducts() {
  return axios.get(`/api/v1/product/admin/products`, config);
}

export function fetchProductById(id) {
  return axios.get(`/api/v1/product/${id}`);
}

export function fetchProductsBrand() {
  return axios.get(`/api/v1/product/brand`);
}

export function createProductBrand(label) {
  return axios.post(`/api/v1/product/brand/new`, label, config);
}

export function fetchProductsCategory() {
  return axios.get(`/api/v1/product/category`);
}

export function createProductCategory(label) {
  return axios.post(`/api/v1/product/category/new`, label, config);
}

export function fetchBanners() {
  return axios.get(`/api/v1/product/banner`);
}

export function deleteBanner(id) {
  return axios.delete(`/api/v1/product/banner/${id}`, config);
}

export function addBanner(banner) {
  return axios.post("/api/v1/product/banner/upload", banner, config);
}

export function productReview(review) {
  return axios.put(`/api/v1/product/review`, review, config);
}

export function deleteProduct(id) {
  return axios.delete(`/api/v1/product/admin/${id}`, config);
}

export function getAllReview(id) {
  return axios.get(`/api/v1/product/review/all?id=${id}`, config);
}

export function deleteReview(data) {
  return axios.delete(
    `/api/v1/product/reviews?productId=${data.productId}&id=${data.selectedReviewId}`,
    config
  );
}
