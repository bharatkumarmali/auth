import axios from "axios";
import api from "./url";

axios.interceptors.request.use(async function (config) {
  const local_token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${local_token}`;
  config.withCredentials = false;
  return config;
});


//-----------------------register------------------------------------
export const register = (data) => {
  return axios.post(api.register, data);
};

//-----------------------user details------------------------------------
export const getUserDetails = () => {
  return axios.get(api.user_details);
};

//-----------------------user update------------------------------------
export const userUpdateDetails = (data) => {
  return axios.patch(api.user_update_details, data);
};

//-----------------------user update photo------------------------------------
export const userUpdatePhoto = (data) => {
  return axios.patch(api.user_update_photo, data);
};

//-----------------------login------------------------------------
export const login = (data) => {
  return axios.post(api.login, data);
};

//-----------------------logout-----------------------------------
export const logout = () => {
  return axios.post(api.logout);
};


