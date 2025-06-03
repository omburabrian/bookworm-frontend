<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";

const router = useRouter();
const isCreateAccount = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  username: "",
  confirmPassword: ""
});
const rememberMe = ref(false);

onMounted(async () => {
  localStorage.removeItem("user");
  // if (localStorage.getItem("user") !== null) {
  //   router.push({ name: "recipes" });
  // }
});

function navigateToBooks() {
  router.push({ name: "recipes" });
}

async function createAccount() {
  if (user.value.password !== user.value.confirmPassword) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Passwords do not match!";
    return;
  }
  
  // Split full name into first and last name
  const fullNameParts = user.value.firstName.split(' ');
  const firstName = fullNameParts[0] || '';
  const lastName = fullNameParts.slice(1).join(' ') || '';
  
  const userData = {
    firstName: firstName,
    lastName: lastName,
    email: user.value.email,
    password: user.value.password,
    // Note: In the real backend, username might be derived from email if not provided
    username: user.value.username || user.value.email // Use email as username if not provided
  };
  
  console.log("Creating account with data:", userData);
  
  try {
    const response = await UserServices.addUser(userData);
    console.log("Create account response:", response);
    
    // Show success message
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = "Account created successfully! Please log in with your email and password.";
    isCreateAccount.value = false;
    
    // Reset form fields
    user.value = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      username: "",
      confirmPassword: ""
    };
    
    // Update login fields with email to make it easier to login
    user.value.email = userData.email;
    
  } catch (error) {
    console.log("Create account error:", error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response?.data?.message || "Failed to create account";
  }
}

async function login() {
  try {
    console.log("Attempting login with:", user.value);
    const userData = await UserServices.loginUser(user.value); // ✅ Renamed for clarity
    console.log("Login response:", userData);

    if (userData) {
      window.localStorage.setItem("user", JSON.stringify(userData)); // ✅ Fixed
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Login successful!";
      router.push({ name: "recipes" });
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.log("Login error:", error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response?.data?.message || "Login failed";
  }
}


function openCreateAccount() {
  isCreateAccount.value = true;
}

function closeCreateAccount() {
  isCreateAccount.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}

function forgotPassword() {
  // Handle forgot password functionality
  console.log("Forgot password clicked");
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="logo-container">
        <h1 class="logo">OC</h1>
      </div>
      
      <div class="login-form">
        <h2 class="login-title">Login</h2>
        
        <div class="form-group">
          <div class="input-icon">
            <v-icon icon="mdi-account" color="#8B0000"></v-icon>
          </div>
          <div class="input-field">
            <label>Username</label>
            <input type="text" v-model="user.email" />
          </div>
        </div>
        
        <div class="form-group">
          <div class="input-icon">
            <v-icon icon="mdi-lock" color="#8B0000"></v-icon>
          </div>
          <div class="input-field">
            <label>Password</label>
            <input type="password" v-model="user.password" />
          </div>
        </div>
        
        <div class="remember-forgot">
          <div class="remember-me">
            <label class="switch">
              <input type="checkbox" v-model="rememberMe">
              <span class="slider round"></span>
            </label>
            <span>remember me</span>
          </div>
          <a href="#" @click.prevent="forgotPassword" class="forgot-link">Forgot Password</a>
        </div>
        
        <button class="login-button" @click="login">Login</button>
        
        <div class="create-account">
          <a href="#" @click.prevent="openCreateAccount">Create account</a>
        </div>
      </div>
    </div>
    
    <v-dialog persistent v-model="isCreateAccount" width="450">
      <div class="signup-container">
        <div class="logo-container">
          <h1 class="logo">OC</h1>
        </div>
        
        <div class="signup-form">
          <h2 class="signup-title">Create Profile</h2>
          <h3 class="signup-subtitle">Sign up</h3>
          
          <div class="form-group">
            <div class="input-icon">
              <v-icon icon="mdi-account" color="#8B0000"></v-icon>
            </div>
            <div class="input-field">
              <label>Full Name</label>
              <input type="text" v-model="user.firstName" />
            </div>
          </div>
          
          <div class="form-group">
            <div class="input-icon">
              <v-icon icon="mdi-email" color="#8B0000"></v-icon>
            </div>
            <div class="input-field">
              <label>Email</label>
              <input type="email" v-model="user.email" />
            </div>
          </div>
          
          <div class="form-group">
            <div class="input-icon">
              <v-icon icon="mdi-account-circle" color="#8B0000"></v-icon>
            </div>
            <div class="input-field">
              <label>Username</label>
              <input type="text" v-model="user.username" />
            </div>
          </div>
          
          <div class="form-group">
            <div class="input-icon">
              <v-icon icon="mdi-lock" color="#8B0000"></v-icon>
            </div>
            <div class="input-field">
              <label>Password</label>
              <input type="password" v-model="user.password" />
            </div>
          </div>
          
          <div class="form-group">
            <div class="input-icon">
              <v-icon icon="mdi-lock-check" color="#8B0000"></v-icon>
            </div>
            <div class="input-field">
              <label>confirm password</label>
              <input type="password" v-model="user.confirmPassword" />
            </div>
          </div>
          
          <div class="button-container">
            <button class="submit-button" @click="createAccount">Submit</button>
          </div>
        </div>
      </div>
    </v-dialog>

    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn
          :color="snackbar.color"
          variant="text"
          @click="closeSnackBar()"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}

.login-container, .signup-container {
  width: 100%;
  max-width: 400px;
  position: relative;
  background-color: #8B0000;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.signup-container {
  max-width: 420px;
  margin: 0 auto;
}

.logo-container {
  padding: 10px;
}

.logo {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.login-form, .signup-form {
  background-color: #e6e6e6;
  border-radius: 8px;
  padding: 20px;
}

.signup-form {
  padding: 15px;
}

.login-title, .signup-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

.signup-title {
  margin-bottom: 0;
  font-size: 1.3rem;
}

.signup-subtitle {
  text-align: center;
  font-size: 1.1rem;
  margin: 5px 0 10px;
  color: #333;
}

.form-group {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}

.input-icon {
  margin-right: 10px;
}

.input-field {
  flex: 1;
}

.input-field label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 2px;
  color: #333;
}

.input-field input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  margin-right: 8px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #8B0000;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.forgot-link {
  color: #8B0000;
  font-size: 0.8rem;
  text-decoration: none;
}

.login-button, .submit-button {
  width: 100%;
  padding: 10px;
  background-color: #8B0000;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 15px;
  transition: background-color 0.3s;
}

.submit-button {
  width: 160px;
  border-radius: 20px;
  margin-bottom: 5px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.login-button:hover, .submit-button:hover {
  background-color: #6B0000;
}

.create-account {
  text-align: center;
}

.create-account a {
  color: #333;
  text-decoration: none;
}
</style>
