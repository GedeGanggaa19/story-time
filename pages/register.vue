<template>
  <div class="register-container container-fluid">
    <div class="info-section px-5">
      <nuxt-link to="/">
        <img src="../asset/logo/storytimeLogo.png" alt="Storytime Logo" class="logo" />
      </nuxt-link>
      <div class="align-items-center justify-content-center judulRegis">
        <h1 class="h1Regis">Join the World's Most-Loved Social Storytelling Platform!</h1>
        <p class="pRegis">
          Create an account to explore interesting articles, connect with like-minded people, and share your own
          stories.
        </p>
        <img src="../asset/register/imgRegister.png" alt="Register Image" class="register-image py-3" />
      </div>
    </div>
    <div class="form-section">
      <h2 class="fw-bold mb-5">Create Account</h2>
      <form @submit.prevent="createAccount">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="form.name" placeholder="Enter your name" required />
        </div>
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="form.username" placeholder="Enter your username" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" placeholder="Enter your email" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="form.password" placeholder="Enter your chosen password"
            :class="passwordClass" @input="validatePassword" required />
          <small v-if="form.password && form.password.length < 8" class="text-danger">
            Password must be at least 8 characters
          </small>
          <small v-else-if="form.password" class="text-success">
            Password length is sufficient
          </small>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" v-model="form.confirm_password"
            placeholder="Re-enter your chosen password" :class="confirmPasswordClass" @input="validateConfirmPassword"
            required />
          <small v-if="form.confirm_password && form.password !== form.confirm_password" class="text-danger">
            Passwords do not match
          </small>
          <small v-else-if="form.confirm_password" class="text-success">
            Passwords match
          </small>
        </div>
        <button type="submit" class="create-account-button">Create Account</button>
        <p v-if="error" class="text-danger mt-3">{{ error }}</p>
      </form>
      <p class="mt-5">Already have an account? <nuxt-link to="/login" class="fw-bold">Login</nuxt-link></p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const form = ref({
      name: '',
      username: '',
      email: '',
      password: '',
      confirm_password: ''
    });

    const error = ref(null);
    const passwordClass = ref('');
    const confirmPasswordClass = ref('');

    const validatePassword = () => {
      passwordClass.value = form.value.password.length >= 8 ? 'border-success' : 'border-danger';
    };

    const validateConfirmPassword = () => {
      confirmPasswordClass.value =
        form.value.password === form.value.confirm_password && form.value.confirm_password
          ? 'border-success'
          : 'border-danger';
    };

    const createAccount = async () => {
      error.value = null;

      if (form.value.password.length < 8) {
        error.value = 'Password must be at least 8 characters long.';
        return;
      }

      if (form.value.password !== form.value.confirm_password) {
        error.value = 'Passwords do not match!';
        return;
      }

      try {
        await authStore.registerUser(form.value);
        router.push('/');
      } catch (err) {
        error.value = err.message || 'Registration failed';
      }
    };

    return {
      form,
      error,
      passwordClass,
      confirmPasswordClass,
      validatePassword,
      validateConfirmPassword,
      createAccount
    };
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  height: 100vh;
  border-radius: 8px;
}

.info-section {
  width: 50%;
  padding-left: 35px;
  background-color: #f0f5ed;
  font-family: playfair-display, serif;
  height: fit-content;
}

.judulRegis {
  margin-top: 50px;
}

.h1Regis {
  font-size: 50px;
  font-weight: 700;
  margin-bottom: 10px;
  justify-content: center;
}

.pRegis {
  font-size: 20px;
  margin-bottom: 20px;
  font-family: dm-sans, sans-serif;
}

.logo {
  width: 100%;
  max-width: 200px;
  margin-bottom: 20px;
  margin-top: 20px;
}

.register-image {
  width: 100%;
  margin-top: 20px;
}

.form-section {
  width: 50%;
  padding: 50px 150px;
  font-family: dm-sans, sans-serif;
}

h2 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
  font-size: small;
}

label {
  display: block;
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 20px;
  border: 2px solid #cccccc;
  border-radius: 10px;
}

.create-account-button {
  background-color: #466543;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 50%;
  font-size: large;
}

.create-account-button:hover {
  background-color: #364934;
}

p {
  font-size: medium;
}

a {
  color: #364934;
  text-decoration: none;
}

.border-success {
  border-color: #28a745 !important;
}

.border-danger {
  border-color: #dc3545 !important;
}

.text-danger {
  color: #dc3545;
}

.text-success {
  color: #28a745;
}
</style>
