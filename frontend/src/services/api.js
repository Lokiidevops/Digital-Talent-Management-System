import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {},
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);
export const verifyOTP = (data) => API.post("/auth/verify-otp", data);
export const resetPassword = (data) => API.post("/auth/reset-password", data);
export const getTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data, { headers: { "Content-Type": "multipart/form-data" }});
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const getUsers = () => API.get("/auth/users");

export const getNotifications = () => API.get("/notifications");
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.put("/notifications/read-all");

export default API;
