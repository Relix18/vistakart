import axios from "axios";

const config = {
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

const link = "http://localhost:4000";

export async function createUser(user) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`/api/v1/register`, user, config);
      resolve(response);
    } catch (error) {
      reject(error.response.data);
    }
  });
}

export async function signOut() {
  return await axios.get(`/api/v1/logout`, config);
}

export function logInUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    const email = loginInfo.email;
    const password = loginInfo.password;

    try {
      const response = await axios.post(
        `/api/v1/login`,
        {
          email,
          password,
        },
        config
      );
      const data = response.data;

      if (data.user) {
        resolve(data.user);
      } else {
        reject({ message: "User not found" });
      }
    } catch (error) {
      reject(error.response.data);
    }
  });
}

export async function fetchLoggedInUser() {
  return await axios.get(`/api/v1/me`, config);
}

export function updateUser(update) {
  return axios.put(`/api/v1/profile/update`, update, config);
}

export function fetchUserAddress() {
  return axios.get(`/api/v1/address`, config);
}

export function addUserAddress(address) {
  return axios.post(`/api/v1/address`, address, config);
}

export function updateUserAddress(address) {
  return axios.put(`/api/v1/address/${address.id}`, address, config);
}

export function deleteUserAddress(id) {
  return axios.delete(`/api/v1/address/${id}`, config);
}

export function allUsers() {
  return axios.get(`/api/v1/admin/users`, config);
}

export function deleteUser(id) {
  return axios.delete(`/api/v1/admin/user/${id}`, config);
}

export function updateUserRole(role) {
  return axios.put(`/api/v1/admin/user/${role.id}`, role, config);
}

export function fetchUserById(id) {
  return axios.get(`/api/v1/admin/user/${id}`, config);
}

export const ChangePassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.put(`/api/v1/password/update`, data, config);
      resolve(response);
    } catch (error) {
      reject(error.response.data);
    }
  });
};

export const forgotPassword = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `/api/v1/password/forgot`,
        email,
        config
      );
      resolve(response);
    } catch (error) {
      reject(error.response.data);
    }
  });
};

export const resetPassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.put(
        `/api/v1/password/reset/${data.token}`,
        data,
        config
      );
      resolve(response);
    } catch (error) {
      reject(error.response.data);
    }
  });
};

export const contactUs = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`/api/v1/contact`, data, config);
      resolve(response);
    } catch (error) {
      reject(error.response.data);
    }
  });
};
