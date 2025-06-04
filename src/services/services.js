import axios from "axios";
var baseurl = "";

// services.js
if (process.env.NODE_ENV === "development") {
  baseurl = "http://localhost/bookwormapi/";
} else {
  baseurl = "/bookwormapi/";
}

console.log("API URL:", baseurl);

const apiClient = axios.create({
  baseURL: baseurl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
    crossDomain: true,
  },
  transformRequest: (data, headers) => {
    let token = null;
    if (localStorage.getItem("user") !== null) {
      token = JSON.parse(localStorage.getItem("user")).token;
    }
    let authHeader = "";
    if (token !== null && token !== "") {
      authHeader = "Bearer " + token;
      headers["Authorization"] = authHeader;
    }
    return JSON.stringify(data);
  },
  transformResponse: function (data) {
    try {
      data = JSON.parse(data);
      if (!data.success && data.code == "expired-session") {
        localStorage.removeItem("user");
      }
      return data;
    } catch (e) {
      console.error("Error parsing response:", e);
      return data;
    }
  },
});

export default apiClient;
