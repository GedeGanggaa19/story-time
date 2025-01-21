import { defineStore } from 'pinia';  
import axios from 'axios';  
import Cookies from 'js-cookie';  
  
export const useAuthStore = defineStore('auth', {  
  state: () => ({  
    user: null,  
    isRegistered: Cookies.get('isRegistered') === 'true', // Initialize based on cookie  
    isLoggedIn: Cookies.get('isLoggedIn') === 'true', // Initialize based on cookie  
  }),  
  
  actions: {  
    async registerUser(payload) {    
      try {    
        const { data } = await axios.post(    
          'https://0f41-103-100-175-121.ngrok-free.app/api/register',    
          {    
            name: payload.name,    
            username: payload.username,    
            email: payload.email,    
            password: payload.password,    
            confirm_password: payload.confirm_password,    
          }    
        );    
    
        this.user = data.data.user;     
        this.isRegistered = true; // Set isRegistered to true on successful registration  
        Cookies.set('isRegistered', true); // Save registration status to cookies  
    
        await this.loginUser({    
          identifier: payload.email,    
          password: payload.password,    
        });    
      } catch (err) {    
        console.error(err.response?.data?.error || 'Registration failed');    
      }    
    },    
  
    async loginUser(payload) {    
      try {    
        const { data } = await axios.post(    
          'https://0f41-103-100-175-121.ngrok-free.app/api/login',    
          {    
            identifier: payload.identifier,    
            password: payload.password,    
          }    
        );    
    
        this.user = data.data.user;     
        this.isLoggedIn = true; // Set isLoggedIn to true on successful login  
        Cookies.set('isLoggedIn', true); // Save login status to cookies  
    
        const token = data.data.token;     
        Cookies.set('authToken', token, { expires: 7 });    
        Cookies.set('user', JSON.stringify(this.user)); // Save user to cookies    
    
        console.log('Expires At:', data.data.expires_at);    
      } catch (err) {    
        console.error(err.response?.data?.error || 'Login failed');    
      }    
    },    
  
    async logoutUser() {    
      try {    
        const token = Cookies.get('authToken');    
        await axios.post('https://0f41-103-100-175-121.ngrok-free.app/api/logout', {}, {    
          headers: {    
            Authorization: `Bearer ${token}`    
          }    
        });    
            
        this.user = null;    
        this.isLoggedIn = false; // Set isLoggedIn to false on logout  
        this.isRegistered = false; // Reset isRegistered on logout  
        Cookies.remove('authToken');    
        Cookies.remove('user');    
        Cookies.remove('isLoggedIn'); // Remove login status from cookies    
        Cookies.remove('isRegistered'); // Remove registration status from cookies    
        
      } catch (err) {    
        console.error(err.response?.data?.error || 'Logout failed');    
      }    
    },    
  
    async fetchUserData() {  
      const token = Cookies.get('authToken'); // Get token from cookies  
      const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null; // Get user from cookies  
      const isLoggedIn = Cookies.get('isLoggedIn') === 'true'; // Get login status from cookies  
      
      if (token) {  
        try {  
          const { data } = await axios.get(  
            'https://0f41-103-100-175-121.ngrok-free.app/api/user',  
            {  
              headers: {  
                Authorization: `Bearer ${token}`,  
                "ngrok-skip-browser-warning": "69420",
              },  
            }  
          );  
      
          // Pastikan data yang diterima memiliki struktur yang benar  
          if (data) {  
            this.user = data; // Update user data  
            this.isLoggedIn = true; // Set status login  
            console.log('User data fetched successfully:', this.user);  
          } else {  
            console.error('Unexpected data structure:', data);  
            this.user = {}; // Set user to empty object if structure is unexpected  
          }  
        } catch (err) {  
          console.error('Error fetching user data:', err);  
          this.user = {}; // Reset user data on error  
        }  
      } else if (user && isLoggedIn) {  
        // If no token but user and login status exist  
        this.user = user;  
        this.isLoggedIn = true;  
      } else {  
        this.isLoggedIn = false; // Ensure isLoggedIn is false if no valid user or token  
      }  
    },  
      
    
    
  
    async updateProfile(formData) {  
      try {  
        const token = Cookies.get('authToken');  
        const { data } = await axios.put(  
          'https://0f41-103-100-175-121.ngrok-free.app/api/update-profile',  
          formData,  
          {  
            headers: {  
              Authorization: `Bearer ${token}`,  
              'Content-Type': 'application/json',  
            },  
          }  
        );  
   
        this.user = data.data.user; // Update user data
        console.log("test",this.user);  
        console.log('Profile updated successfully:', data.data.message);  
      } catch (err) {  
        console.error('Error response:', err.response?.data); // Log the full error response  
        console.error(err.response?.data?.error || 'Profile update failed');  
      }  
    },   
  
    async changePassword(passwordData) {  
      try {  
        const token = Cookies.get('authToken');  
        const { data } = await axios.put(  
          'https://0f41-103-100-175-121.ngrok-free.app/api/change-password',  
          passwordData,  
          {  
            headers: {  
              Authorization: `Bearer ${token}`,  
            },  
          }  
        );  
      
        console.log('Password changed successfully:', data.data.message);  
      } catch (err) {  
        console.error(err.response?.data?.error || 'Password change failed');  
      }  
    },      
  
    async updateImage(imageData) {    
      try {    
          const token = Cookies.get('authToken');    
          const { data } = await axios.post(    
              'https://0f41-103-100-175-121.ngrok-free.app/api/update-image',    
              imageData,    
              {    
                  headers: {    
                      Authorization: `Bearer ${token}`,    
                      'Content-Type': 'multipart/form-data',    
                  },    
              }    
          );    
      
          // Log the entire response to see the structure    
          console.log('Image update response:', data);    
      
          // Update user data    
          this.user = data.data.user;     
      
          // Check if the image URL is correctly returned    
          const imagePath = data.data.image_url; // Ensure this matches the response    
          if (imagePath) {    
              this.imagePath = imagePath; // Save image URL    
              console.log('Image updated successfully:', data.data.message);    
              console.log('Image path:', this.imagePath);    
          } else {    
              console.error('Image path is undefined in the response. Please check the server response structure.');    
          }    
      } catch (err) {    
          console.error(err.response?.data?.error || 'Image update failed');    
      }    
    }    
  },  
});  
