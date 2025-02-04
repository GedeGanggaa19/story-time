<template>      
  <div class="d-flex justify-content-center">      
    <div class="card">      
      <div class="image-container">      
        <img :src="imageSrc" class="card-img-top card-image" alt="..." />      
        <div class="bookmark-icon"></div>      
      </div>      
      <div class="card-body">      
        <h5 class="card-title fw-bold fontdmSans">{{ title }}</h5>      
        <p class="card-text description fontDmSans">{{ description }}</p>      
        <div class="footer-card">      
          <img :src="profilePic" class="profile-pic" alt="Profile Picture" />      
          <div class="bottom-card justify-content-between d-flex align-items-center">    
            <div>      
              <p class="mb-0 fontDmSans">{{ userName }}</p>      
            </div>      
            <div class="d-flex align-items-center">      
              <p class="mb-0 fontDmSans">{{ createdAt }}</p>            
            </div>      
          </div>      
        </div>      
      </div>      
    </div>      
  </div>      
</template>      
      
<script>      
export default {      
  props: {      
    imageSrc: {      
      type: String,      
      required: true,      
    },      
    profilePic: {      
      type: String,      
      required: true,      
    },      
    title: {      
      type: String,      
      required: true,      
    },      
    description: {      
      type: String,      
      required: true,      
    },      
    userName: {      
      type: String,      
      required: true,      
    },      
    createdAt: {      
      type: String,      
      required: true,      
    },      
    category: {      
      type: String,      
      required: true,      
    },      
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
    
.card-image {      
  border-radius: 15px;        
  height: 300px; /* Set a fixed height for the image */    
  width: 100%; /* Make the image responsive */    
  transition: transform 0.3s ease, opacity 0.3s ease; /* Add transition for transform and opacity */    
}        
    
.card {      
  border: none;           
  text-align: left;  
  height: max-content; /* Allow the card to adjust its height based on content */  
  width: 100%; /* Make the card responsive */    
  transition: background-color 0.3s ease; /* Optional: smooth background transition */  
}      
      
.card:hover { /* Change the title color on card hover */  
  background-color: rgba(255, 255, 255, 0.9); /* Optional: change background on hover */  
}  
  
.card:hover .card-title { /* Change title color on card hover */  
  color: #466543; /* Change title color to #466543 */  
}  
  
.card:hover .card-image {        
  opacity: 0.5;      
}         
    
.card-title {      
  font-size: 24px;    
  color: #222222; /* Default title color */  
}      
    
.description {      
  display: -webkit-box; /* For WebKit support */      
  -webkit-box-orient: vertical; /* Set box orientation */      
  -webkit-line-clamp: 3; /* Limit the number of lines to 3 */      
  overflow: hidden; /* Hide overflow text */      
  text-overflow: ellipsis; /* Add ellipsis */      
  line-height: 1.5; /* Set line height for aesthetics */      
  max-height: 4.5em; /* Set max height for 3 lines */ 
  font-size: 15px;     
}     
    
.footer-card {      
  display: flex;      
  align-items: center;      
  font-size: 15px; 
      
}      
    
.profile-pic {      
  width: 30px;      
  height: 30px;      
  border-radius: 50%;      
  margin-right: 10px;      
}        
    
.image-container {      
  position: relative;      
}      
    
.bookmark-icon {      
  position: absolute;      
  bottom: 20px;       
  right: 20px;       
  width: 50px;      
  height: 50px;      
  background-color: #466543;      
  display: flex;      
  justify-content: center;      
  align-items: center;      
  cursor: pointer;      
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);       
  border-radius: 50%;  
  transition: transform 0.3s ease; 
}      
    
.card:hover .bookmark-icon {    
  transform: translateY(-5px);    
}

.bookmark-icon::after {      
  content: '';       
  width: 55%; /* Adjust size */      
  height: 55%; /* Adjust size */     
  background-image: url('../asset/icon/iconBookmark.png'); /* Use your bookmark icon */      
  background-size: cover; /* Cover the area */      
}      
    
.bottom-card {    
  width: 100%;    
}    
</style>      
