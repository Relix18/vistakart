import axios from "axios";

const config = {
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

export const paymentGenerate = async (amount) => {
  const { data } = await axios.post(`/api/v1/payment/process`, amount, config);

  return data;
};

export const paymentKey = async () => {
  const { data } = await axios.get(`/api/v1/getkey`, config);

  return data;
};
