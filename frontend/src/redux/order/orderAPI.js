import axios from "axios";

const config = {
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

export const fetchCreateOrder = (order) => {
  return axios.post(`/api/v1/order/me`, order, config);
};

export const fetchOrdersByUser = () => {
  return axios.get(`/api/v1/order/me`, config);
};

export const fetchOrderById = (id) => {
  return axios.get(`/api/v1/order/${id}`, config);
};

export const allOrders = () => {
  return axios.get(`/api/v1/admin/orders`, config);
};

export const deleteOrder = (id) => {
  return axios.delete(`/api/v1/admin/order/${id}`, config);
};

export const updateOrder = (order) => {
  return axios.put(`/api/v1/admin/order/${order.id}`, order, config);
};
