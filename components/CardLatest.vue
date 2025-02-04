<template>        
  <div class="d-flex">        
    <div class="card fontDmSans">        
      <div class="image-container">        
        <img :src="imageSrc" class="card-img-top card-image" alt="..." />        
        <div class="bookmark-icon"></div>        
      </div>        
      <div class="card-body">        
        <h5 class="card-title fw-bold fontdmsans">{{ title }}</h5>        
        <p class="card-text description fontDmSans">{{ description }}</p>      
        <div class="footer-card">        
          <img :src="profilePic" class="profile-pic" alt="Profile Picture" />        
          <div class="bottom-card justify-content-between d-flex align-items-center">        
            <div>        
              <p class="mb-0 fontDmSans">{{ userName }}</p>        
            </div>        
            <div class="d-flex align-items-center">        
              <p class="mb-0 me-2 fontDmSans">{{ createdAt }}</p>        
              <div class="category">        
                <p class="mb-0 fontDmSans">{{ category }}</p>        
              </div>        
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
      
.image-container {      
  position: relative;   
  width: 100%;
  height: 400px; /* Fixed height */
  overflow: hidden;
  border-radius: 10px;   
}      

.card-image {      
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;      
}      
          
.card {        
  border: none;         
  width: 400px;         
  margin-right: 15px;         
  margin-bottom: 20px;       
  text-align: left;      
  transition: background-color 0.3s ease;
}       
          
.card:hover { 
  background-color: rgba(255, 255, 255, 0.9);
}  
  
.card:hover .card-title {
  color: #466543;
}  
  
.card:hover .card-image {        
  opacity: 0.5;      
}        
          
.card-title {      
  padding-left: 0;      
  padding-right: 0;     
  font-size: 24px;     
  color: #222222;
}      
        
.description {      
  display: -webkit-box;     
  -webkit-box-orient: vertical;    
  -webkit-line-clamp: 3;     
  overflow: hidden;     
  text-overflow: ellipsis;     
  line-height: 1.5;     
  max-height: 4.5em;
  font-size: 15px;      
}     
          
.footer-card {      
  display: flex;      
  align-items: center;      
  font-size: 15px;     
}      
          
.profile-pic {      
  width: 40px;      
  height: 40px;      
  border-radius: 50%;      
  margin-right: 10px;
  object-fit: cover;      
}      
          
.category {      
  background-color: #f0f5ed;      
  color: #466543;      
  padding: 5px 10px;      
  border-radius: 5px;      
  text-align: left;      
}      
        
.bookmark-icon {      
  position: absolute;      
  bottom: 20px;       
  right: 20px;       
  width: 60px;      
  height: 60px;      
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
  width: 55%;     
  height: 55%;    
  background-image: url('../asset/icon/iconBookmark.png');     
  background-size: cover;     
}      
        
.bottom-card {      
  width: 100%;      
}      
</style>