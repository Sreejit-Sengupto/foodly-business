import { BACKEND_URL } from "@/lib/constants";
import axios from "axios";

const axsInstance = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  timeout: 20000,
  withCredentials: true,
});

axsInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url === "/auth/refresh-token") {
      console.error("Refresh token invalid—logging out.");
      // window.location.href = "/"
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("originalRequest before setting _retry:", originalRequest);
      console.log(
        "originalRequest._retry before setting:",
        originalRequest._retry,
      );

      originalRequest._retry = true;

      console.log("originalRequest after setting _retry:", originalRequest);
      console.log(
        "originalRequest._retry after setting:",
        originalRequest._retry,
      );

      try {
        await axsInstance.post("/auth/refresh-token");
        return axsInstance(originalRequest);
      } catch (err) {
        console.error("Refresh token failed: ", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default axsInstance;
