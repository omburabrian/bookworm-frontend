import apiClient from "./services";

export default {
  async getUser() {
    try {
      const response = await apiClient.get("users");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  },

  async addUser(user) {
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    };

    try {
      console.log("Registering user:", { email: user.email }); // Avoid logging password
      const response = await apiClient.post("users", userData);
      return response.data;
    } catch (error) {
      console.error("User registration failed:", error);
      throw error;
    }
  },

  async loginUser(user) {
    try {
      console.log("Attempting login for:", { email: user.email }); // Avoid logging password
      const response = await apiClient.post("login", {
        email: user.email,
        password: user.password,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          crossDomain: true,
          Authorization: `Basic ${btoa(`${user.email}:${user.password}`)}`,
        },
      });

      // Optionally store token if backend sends one
      // localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  },

  async logoutUser() {
    try {
      const response = await apiClient.post("logout");
      // Optionally remove token
      // localStorage.removeItem("token");
      return response.data;
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },
};
