import axios from "axios";

const config = {
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};
const link = "http://localhost:4000";

export function fetchItemsByUser() {
  return axios.get(`/api/v1/cart`, config);
}

export function addItem(item) {
  return axios.post(`/api/v1/cart`, item, config);
}

export function updateItem(item) {
  return axios.put(`/api/v1/cart/${item.id}`, item, config);
}

export function deleteItem(id) {
  return axios.delete(`/api/v1/cart/${id}`, config);
}

export function resetCart() {
  return new Promise(async (resolve) => {
    try {
      const { data } = await fetchItemsByUser();
      const items = data.cart;
      for (let item of items) {
        await deleteItem(item._id);
      }
      resolve({ status: "success" });
    } catch (error) {
      resolve({ status: "error", message: error.message });
    }
  });
}
