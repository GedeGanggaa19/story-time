<template>    
  <div class="footer bg-white fontdmsans">  
    <div class="container d-flex justify-content-between align-items-center">    
      <p>© 2024 PT. Timedoors Indonesia. All rights reserved.</p>    
      <div class="social-icons">    
        <a href="https://www.facebook.com" target="_blank">    
          <i class="fa-brands fa-square-facebook"></i>  
        </a>    
        <a href="https://www.instagram.com" target="_blank">    
          <i class="fa-brands fa-square-instagram"></i>  
        </a>    
        <a href="https://www.youtube.com" target="_blank">    
          <i class="fa-brands fa-youtube"></i>  
        </a>    
      </div>   
    </div>   
  </div>    
</template>    
      
<script>    
export default {    
  name: 'Footer',    
}    
</script>    
      
<style scoped>    
.fontPlayfair {  
  font-family: playfair-display, serif;  
}  
  
.fontDmSans {  
  font-family: dm-sans, sans-serif;  
}  
  
.footer {    
  display: flex;  
  justify-content: space-between;  
  text-align: center;    
  padding: 20px;     
  border-top: 1px solid black;    
}   
  
.social-icons a {    
  margin: 0 5px;    
  color: #222222; /* Default color for icons */  
  text-decoration: none;    
  transition: color 0.3s ease; /* Smooth transition for color change */  
}    
  
.social-icons a:hover {    
  color: #466543; /* Change color on hover */  
}  
  
.social-icons i {    
  font-size: 36px; /* Ukuran ikon */    
}    
</style>    
