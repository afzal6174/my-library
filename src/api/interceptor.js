import api from "@/axios/api";

const token = "jhdjfhdjfhdjfh";

api.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = "Bearer " + token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (err) => {
    if (err.response) {
      // error came from server
      err.message = `Error from server: status: ${err.response.status} - message: ${err.response.statusText}`;
    }

    return Promise.reject(err?.message);
  }
);
