<template>         
  <div class="d-flex">        
    <div class="card fontDmSans">        
      <div class="image-container">        
        <img :src="imageSrc" class="card-img-top card-image" alt="..." />        
        <div class="bookmark-icon"></div>       
      </div>        
      <div class="card-body">        
        <h5 class="card-title fw-bold fontdmSans">{{ title }}</h5>        
        <p class="card-text description fontDmSans">{{ description }}</p>        
        <div class="footer-card">        
          <img :src="profilePic" class="profile-pic" alt="Profile Picture" />        
          <div class="bottom-card d-flex align-items-center justify-content-between">    
            <div>        
              <p class="mb-0 fontDmSans">{{ userName }}</p>        
            </div>        
            <div class="d-flex align-items-center ml-auto">        
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
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;      
}      
    
.card {        
  border: none; /* Menghilangkan border pada card */             
  overflow: visible; /* Pastikan konten tidak dapat digulir */      
  text-align: left;      
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
  display: -webkit-box; /* Untuk mendukung WebKit */      
  -webkit-box-orient: vertical; /* Mengatur orientasi kotak */      
  -webkit-line-clamp: 3; /* Membatasi jumlah baris menjadi 3 */      
  overflow: hidden; /* Menyembunyikan teks yang melampaui batas */      
  text-overflow: ellipsis; /* Menambahkan titik-titik */      
  line-height: 1.5; /* Mengatur tinggi baris untuk estetika */      
  max-height: 4.5em; /* Mengatur tinggi maksimum untuk 3 baris */
  font-size: 15px;     
}     
    
.footer-card {        
  display: flex;        
  align-items: center; /* Menyelaraskan elemen secara vertikal */        
  font-size: 15px; /* Ukuran font untuk footer */        
}        
    
.profile-pic {        
  width: 40px; /* Lebar gambar profil */        
  height: 40px; /* Tinggi gambar profil */        
  border-radius: 50%; /* Membuat gambar profil menjadi bulat */        
  margin-right: 10px; /* Jarak antara gambar dan nama */        
}        
    
.image-container {      
  position: relative;   
  width: 100%;
  height: 700px; /* Fixed height */
  overflow: hidden;
  border-radius: 10px;   
}    
          
.bookmark-icon {      
  position: absolute;      
  bottom: 40px;       
  right: 40px;       
  width: 80px;      
  height: 80px;      
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
  width: 45%; /* Adjust size */      
  height: 45%; /* Adjust size */      
  background-image: url('../asset/icon/iconBookmark.png'); /* Use your bookmark icon */      
  background-size: cover; /* Cover the area */      
}      
    
.bookmark-icon:hover {      
  background-color: #31472f;    
}    
    
.bottom-card {    
  width: 100%;    
}    
</style>        
