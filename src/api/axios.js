import axios from "axios";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export const setBaseURL = (url) => {
  api.defaults.baseURL = url;
};

export const getData = (url) => api.get(url);
export const postData = (url, data) => api.post(url, data);
export const updateData = (url, data) => api.patch(url, data);
export const deleteData = (url) => api.delete(url);

export default api;
