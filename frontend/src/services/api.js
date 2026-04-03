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

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized API call (401). NOT redirecting to login to allow debugging. Error message:", error.response?.data?.message);
    }
    return Promise.reject(error);
  }
);

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const forgotPassword = (data) => API.post("/forgot/forgot-password", data);
export const verifyOTP = (data) => API.post("/forgot/verify-otp", data);
export const resetPassword = (data) => API.post("/forgot/reset-password", data);
export const getTasks = () => API.get("/tasks/my");
export const getAllTasksAdmin = () => API.get("/tasks/all");
export const createTask = (data) => API.post("/tasks", data, { headers: { "Content-Type": "multipart/form-data" }});
export const updateTaskAdmin = (id, data) => API.put(`/tasks/admin/${id}`, data);
export const updateTaskStatus = (id, status) => API.put(`/tasks/${id}`, { status });
export const submitTask = (id, data) => API.post(`/tasks/submit/${id}`, data, { headers: { "Content-Type": "multipart/form-data" }});
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const getAdminStats = () => API.get("/tasks/stats");
export const getUsers = () => API.get("/auth/users");

export const getNotifications = () => API.get("/notifications");
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.put("/notifications/read-all");

export const updateProfile = (data) => API.put("/auth/update-profile", data);
export const toggle2FA = () => API.post("/auth/toggle-2fa");

// Admin Approval System
export const verifyEmailToken = (token) => API.get(`/auth/verify-email?token=${token}`);
export const getPendingAdmins = () => API.get("/admin-approval/pending");
export const respondToAdminRequest = (id, status) => API.post(`/admin-approval/${id}`, { status });

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default API;
