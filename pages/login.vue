<template>
  <div class="login-container container-fluid">
    <div class="form-section">
      <nuxt-link to="/"> 
        <img src="../asset/logo/storytimeLogo.png" alt="Storytime Logo" class="logo" />
      </nuxt-link>
      <div class="login py-3">
        <h1 class="mb-5 fw-bold">Login</h1>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="identifier" class="mb-3">Username / Email</label>
            <input type="text" id="identifier" v-model="form.identifier" placeholder="Enter your username or email" required />
          </div>
          <div class="form-group">
            <label for="password" class="mb-3">Password</label>
            <input type="password" id="password" v-model="form.password" placeholder="Enter your chosen password" required />
          </div>
          <button type="submit" class="login-button">Login</button>
          <p v-if="error" class="text-danger">{{ error }}</p> 
        </form>
        <p class="mt-5">Don't have an account? <nuxt-link to="/register" class="fw-bold">Register</nuxt-link></p>
      </div>
    </div>
    <div class="welcome-section">
      <h2 class="h2Login">Welcome Back to <br><span>Story Time!</span></h2>
      <p class="pLogin">Dive back into captivating stories, follow your favorite authors, and continue sharing your own tales.</p>
      <img src="../asset/login/imgLogin.png" alt="Login Image" class="welcome-image py-3" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth'; // Mengimpor store Pinia
import { useRouter } from 'vue-router'; // Mengimpor useRouter

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter(); // Menggunakan router
    const form = ref({
      identifier: '', // Mengganti username dengan identifier
      password: ''
    });
    const error = ref(null); // Menyimpan pesan kesalahan

    const login = async () => {
      error.value = null; // Reset error sebelum login
      try {
        await authStore.loginUser(form.value); // Memanggil action loginUser
        router.push('/'); // Arahkan ke halaman index setelah login berhasil
      } catch (err) {
        error.value = err.message || 'Login failed'; // Menangani kesalahan
      }
    };

    return {
      form,
      error,
      login
    };
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: space-between;
  border-radius: 8px; 
  padding: 15px;
  height: 100vh;
}

.form-section {
  width: 50%;
  font-family: dm-sans, sans-serif;
}

.login {
  padding: 0px 150px;
  margin-top: 80px;
}

.logo {
  width: 100%; 
  max-width: 200px; 
  margin-bottom: 20px;
  margin-left: 50px; 
  margin-top: 20px;
}

.welcome-section {
  width: 50%;
  background-color: #F0F5ED;
  font-family: playfair-display, serif;
  height: fit-content;
}

.h2Login {
  font-size: 50px;
  font-weight: 700; 
  padding: 100px 100px 0px 100px;
}

.pLogin {
  font-size: 20px;
  font-family: dm-sans, sans-serif; 
  padding: 0px 100px 0px 100px;
  text-shadow: 2px 2px 2px rgba(121, 120, 120, 0.5);
}

.welcome-image {
  width: 100%;
  margin-top: 20px; 
}

.form-group {
  margin-bottom: 15px;
  font-size: small;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #cccccc;
}

.login-button {
  background-color: #466543;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: large;
}

.login-button:hover {
  background-color: #364934;
}

p {
  margin-top: 20px; 
}

a {
  color: #364934;
  text-decoration: none; 
}
</style>
