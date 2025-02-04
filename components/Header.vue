<template>  
  <nav class="navbar navbar-expand-lg bg-white p-3 sticky-top">  
    <div class="container">  
      <!-- Logo -->  
      <nuxt-link class="navbar-brand" to="/">  
        <img src="../asset/logo/storytimeLogo.png" alt="Logo" class="logo" />  
      </nuxt-link>  
  
      <!-- Buttons -->  
      <div class="d-flex align-items-center">  
        <nuxt-link v-if="!isLoggedIn" to="/register">  
          <button class="btn register me-2">Register</button>  
        </nuxt-link>  
        <nuxt-link v-if="!isLoggedIn" to="/login">  
          <button class="btn login">Login</button>  
        </nuxt-link>  
        <div v-if="isLoggedIn" class="dropdown">  
          <button class="btn profile dropdown-toggle d-flex align-items-center fw-bold" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">  
            <img v-if="user?.image" :src="user.image" alt="Profile Image" class="profile-image me-2" />  
            <img v-else :src="defaultImage" alt="Default Profile Image" class="profile-image me-2" />  
            {{ user.username || 'User' }}  
          </button>  
          <ul class="dropdown-menu" aria-labelledby="profileDropdown">  
            <li>  
              <nuxt-link class="dropdown-item" to="/profile">My Profile</nuxt-link>  
            </li>  
            <li>  
              <button class="dropdown-item" @click="openLogoutModal">Logout</button>  
            </li>  
          </ul>  
        </div>  
      </div>  
    </div>  
  
    <!-- Logout Modal -->  
    <div v-if="isLogoutModalOpen" class="modal-overlay">  
      <div class="modal-content">  
        <div class="align-items-center">  
          <h2 class="fs-2 mb-3">Logout</h2>  
        </div>  
        <p>Are you sure you want to logout?</p>  
        <div class="button mt-3 align-items-center">  
          <button @click="closeLogoutModal" class="btn btn-cancel me-5">Cancel</button>  
          <button @click="logout" class="btn btn-logout">Logout</button>  
        </div>  
      </div>  
    </div>  
  </nav>  
</template>  
  
<script>  
import { useAuthStore } from '@/store/auth';
import defaultImage from '@/asset/icon/User.png'; // Import default image  
import { ref, computed } from 'vue'; // Import ref and computed  
import { useRouter } from 'vue-router'; // Import useRouter  
import Cookies from 'js-cookie'; // Import js-cookie for cookie management  
  
export default {  
  setup() {  
    
    const authStore = useAuthStore(); 
    const isLogoutModalOpen = ref(false); // State for logout modal  
    const router = useRouter(); // Initialize router  
  
    // Reactive property for login status  
    const isLoggedIn = computed(() => {  
      return Cookies.get('isLoggedIn') === 'true';  
    });  
  
    // Function to get user data from cookies 
    
    const user = ref({}); 
    const getUserData = async() => {  
      await authStore.fetchUserData(); 
      console.log('yui', authStore.user);
      user.value = authStore.user;
    };  
   // Get user data from cookies 
    getUserData(); 
  
    const openLogoutModal = () => {  
      isLogoutModalOpen.value = true; // Show logout modal  
    };  
  
    const closeLogoutModal = () => {  
      isLogoutModalOpen.value = false; // Close logout modal  
    };  
  
    const logout = async () => {  
      const token = Cookies.get('authToken'); // Get token from cookies  
      if (token) {  
        await fetch('https://06b1-103-100-175-121.ngrok-free.app/api/logout', {  
          method: 'POST',  
          headers: {  
            'Authorization': `Bearer ${token}`,  
          },  
        });  
      }  
      // Clear cookies and reset user data  
      Cookies.remove('authToken');  
      Cookies.remove('user');  
      Cookies.remove('isLoggedIn');  
      closeLogoutModal(); // Close modal after logout  
  
      // Cek apakah pengguna berada di halaman '/'  
      if (router.currentRoute.value.path === '/') {  
        // Jika di halaman '/', redirect dan refresh  
        router.push('/'); // Redirect ke halaman /  
        window.location.reload(); // Refresh halaman  
      } else {  
        // Jika tidak di halaman '/', hanya redirect  
        router.push('/'); // Redirect ke halaman /  
      }  
    };  
  
    return {  
      user,  
      logout,  
      defaultImage,  
      isLogoutModalOpen,  
      openLogoutModal,  
      closeLogoutModal,  
      isLoggedIn, // Return the computed property for login status  
    };   
  },  
};  
</script>  
  
<style scoped>  
.fontPlayfair {  
  font-family: playfair-display, serif;  
}  
  
.fontDmSans {  
  font-family: dm-sans, sans-serif;  
}  
  
.logo {  
  height: 50px;  
  width: auto;  
}  
  
.navbar {  
  border-bottom: 1px solid #dee2e6;  
  z-index: 1;  
}  
  
.register {  
  border: 2px solid #466543;  
  color: #466543;  
}  
  
.register:hover {  
  border: 2px solid #222222;  
  color: #222222;  
}  
  
.login {  
  background-color: #466543;  
  color: white;  
}  
  
.login:hover {  
  background-color: #364934;  
  color: white;  
}  
  
.profile {  
  background-color: transparent;  
  border: none;  
  font-size: 18px;  
}  
  
.profile-image {  
  width: 50px;  
  height: 50px;  
  border-radius: 50%;  
}  
  
.dropdown-menu {  
  min-width: 150px;  
}  
  
.dropdown-item {  
  color: black; /* Default text color */  
  background-color: white; /* Ensure background is white */  
}  
  
.dropdown-item:hover {  
  color: #466543; /* Change text color on hover */  
  background-color: white; /* Keep background white on hover */  
}  
  
.dropdown-item:focus {  
  color: #466543; /* Change text color when focused */  
  background-color: white; /* Keep background white when focused */  
}  
  
/* Styles for Logout Modal */  
.modal-overlay {  
  position: fixed;  
  top: 0;  
  left: 0;  
  right: 0;  
  bottom: 0;  
  background: rgba(0, 0, 0, 0.6);  
  display: flex;  
  justify-content: center;  
  align-items: center;  
  z-index: 1000;  
}  
  
.modal-content {  
  text-align: center;  
  background: white;  
  padding: 30px;  
  border-radius: 10px;  
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);  
  width: 370px;  
}  
  
.btn-cancel {  
  padding: 10px 20px;  
  font-size: 20px;  
  border: 2px solid #466543;  
  color: #466543;  
}  
  
.btn-cancel:hover {  
  border: 2px solid #222222;  
  color: #222222;  
}  
  
.btn-logout {  
  padding: 10px 20px;  
  font-size: 20px;  
  background-color: #466543;  
  color: white;  
}  
  
.btn-logout:hover {  
  background-color: #364934;  
  color: white;  
}  
</style>  
