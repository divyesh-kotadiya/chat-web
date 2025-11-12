import http from "./http";

export const userAPI = {
  login: (credentials) => http.post("/users/login", credentials),

  signup: (userData) => http.post("/users/signup", userData),

  protect: () => http.post("/users/protect"),

  isPresent: (data) => http.post("/users/ispresent", data),

  updateMe: (data) => http.post("/users/updateMe", data),

  uploadPhoto: (formData) =>
    http.post("/users/uploadPhoto", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  searchUsers: (query) => http.get(`/users?search=${encodeURIComponent(query)}`),
};
