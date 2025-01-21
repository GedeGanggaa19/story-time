<template>  
  <div>  
    <Header></Header>  
  
    <!-- Breadcrumb Navigation -->  
    <nav class="breadcrumb container-fluid fontDmSans">  
      <a href="/" class="breadcrumb-item"><span>Home</span></a>  
      <span class="breadcrumb-separator">/</span>  
      <a href="allStory" class="breadcrumb-item"><span>{{ title }}</span></a>  
    </nav>  
  
    <main class="detail-page container">  
      <article class="detail-content">  
        <div class="detail-header">  
          <p class="date fontDmSans">{{ date }}</p>  
          <h1 class="title my-5 fontPlayfair">{{ title }}</h1>  
          <div class="author-info mb-5">  
            <img :src="profilePic" alt="Profile Picture" class="profile-pic" />  
            <p class="author fontDmSans">{{ author }}</p>  
          </div>  
        </div>  
        <div class="row content-wrapper mb-5">  
          <div class="col-md-4 pe-4">  
            <img :src="imageSrc" alt="Guardians of the Galaxy" class="cover-image" />  
            <div class="image-grid">  
              <div class="grid-container">  
                <img v-for="(img, index) in imageGrid" :key="index" :src="imageSrc" alt="Gallery Image" class="grid-image" />  
              </div>  
            </div>  
          </div>  
          <div class="col-md-8 text-content ps-4 mb-5 fontDmSans">  
            <p v-for="(paragraph, index) in content" :key="index">{{ paragraph }}</p>  
          </div>  
        </div>  
        <div class="bookmark-icon" @click="bookmarkStory"></div>  
      </article>  
  
      <!-- Similar Stories Section -->  
      <section class="similar-stories mt-5">  
        <h2 class="fontPlayfair">Similar Stories</h2>  
        <hr class="my-5">
        <div class="d-flex flex-wrap">  
          <CardLatest  
            v-for="(story, index) in similarStories"  
            :key="index"  
            :imageSrc="imageSrc"  
            :profilePic="profilePic"  
            :title="story.title"  
            :description="story.description"  
            :userName="story.userName"  
            :createdAt="story.createdAt"  
            :category="story.category"  
            class="mb-5"
          />  
        </div>  
      </section>  
    </main>  
    <Footer class="mt-5"></Footer>  
  </div>  
</template>  
  
<script>  
import imageSrc from '../asset/home/test.jpg'; // Adjust the path as necessary  
import profilePic from '../asset/home/test.jpg'; // Use the specified profile picture  
import CardLatest from '~/components/CardLatest.vue';  
  
export default {  
  name: 'DetailPage',  
  components: { CardLatest },  
  data() {  
    return {  
      title: 'Guardians of the Galaxy Vol. 3',  
      date: '15 May 2023',  
      author: 'By Juliana Putra',  
      imageSrc: imageSrc,  
      profilePic: profilePic, // Using the specified profile picture  
      content: [  
        'At their new headquarters on Knowhere, the Guardians of the Galaxy are attacked by Adam Warlock, a Sovereign warrior created by the High Evolutionary. Adam discovers the Guardians dramatically need Rocket, who is injured on Nebula\'s ship. The Guardians are unable to find Rocket\'s whereabouts and, as a last resort, made by the company Orgosphere, embarks on him. They travel to Orgosphere headquarters to find the elusive code.',  
        'As Rocket is unconscious, he recalls his past. As a baby raccoon, he was experimented on by the High Evolutionary, a scientist who exploits his science and technological capabilities to create a Counter-Earth. Rocket befriends the High Evolutionary\'s other subjects, including the walrus Teefs and the rabbit Floor. The High Evolutionary is impressed by Rocket\'s intelligence but treats the other subjects harshly. Rocket finally tries to escape with his friends, but the High Evolutionary orders them to be exterminated and his friends are enhanced. Rocket finally tries to go to the High Evolutionary to take his place instead.',  
        'In the present, the abominable version of Gamora (who has joined the Ravagers) helps the Guardians infiltrate Orgosphere. They retrieve Rocket, but discover that the code has been removed. The group speculates that the one of the High Evolutionary\'s previous locks is to key discover Counter-Earth. They are followed by the previous villain, who ordered for their capture.',  
        'Upon arriving, the residents implore to find the High Evolutionary\'s ship. One of Rocket\'s friends remains with Gamora and Rocket\'s friend, Peter Quill, and Nebula must find the High Evolutionary\'s ship. Nebula is tasked to send out a distress signal to get help from the Guardians.',  
        'The High Evolutionary initiates the destruction of Counter-Earth, which will kill all of the planets, including Earth. As the ship enters orbit, Quill and Groot begin to find the interesting ship to destroy the Guardians\' ship. They are joined by Rocket, Nebula, and Adam Warlock, who is now a member of the Guardians.',  
        'Meanwhile, Peter Quill once more reunites with his estranged children on Earth before being interrupted by the Guardians. They are tasked to save the universe from the High Evolutionary\'s plans. In the aftermath, Quill vows the Guardians, becoming the capacity to travel back to Earth to reunite with his grandfather Jason. Nebula embarks on a journey of self-discovery with the Abilisk. Gamora reunites with the Ravagers, and Nebula finds a new sense of purpose. The Guardians, consisting of Rocket, Groot, Cosmo, Kraglin, Adam, (who is rescued children), and Adam\'s pet Blurp, take on a new mission in space while Quill\'s grandfather visits Jason.'  
      ],  
      imageGrid: [  
        imageSrc,  
        imageSrc,  
        imageSrc,  
        imageSrc  
      ],  
      similarStories: [  
        {  
          title: 'Harry Potter and the Philosopher’s Stone',  
          description: 'Harry Potter and the Philosopher’s Stone is a fantasy novel written by British author J.K. Rowling.',  
          userName: 'Kim Jong In',  
          createdAt: '14 July 2023',  
          category: 'Romance'  
        },  
        {  
          title: 'Spring in London',  
          description: 'A story about love and adventure in the vibrant city of London.',  
          userName: 'Kim Jong In',  
          createdAt: '05 July 2023',  
          category: 'Drama'  
        },  
        {  
          title: 'Autumn in Paris',  
          description: 'A romantic tale set against the backdrop of beautiful Paris in autumn.',  
          userName: 'Kim Jong In',  
          createdAt: '05 July 2023',  
          category: 'Romance'  
        }  
      ]  
    };  
  },  
  methods: {  
    bookmarkStory() {  
      // Logic to handle bookmarking the story  
      alert('Story bookmarked!');  
    }  
  }  
}  
</script>  

<style scoped>

.fontPlayfair {
  font-family: playfair-display, serif;
}

.fontDmSans {
  font-family: dm-sans, sans-serif;
}
  
  /* Breadcrumb Styles */  
  .fontPlayfair {  
  font-family: playfair-display, serif;  
  }  
  
  .fontDmSans {  
  font-family: dm-sans, sans-serif;  
  }  
  
.detail-page {  
  padding: 20px;  
}  
  
.detail-header {  
  text-align: center;  
  margin-bottom: 20px;  
}  
  
.detail-content {  
  margin: auto;  
}  
  
.title {  
  font-size: 50px; 
  font-weight: bold;
  margin-bottom: 10px;  
}  
  
.date,  
.author {  
  color: black;  
  margin: auto 10px;
}  
  
.author-info {  
  display: flex;  
  align-items: center;  
  justify-content: center;  
}  
  
.profile-pic {  
  width: 3%; /* Adjust size */  
  height: 3%; /* Adjust size */  
  border-radius: 50%; /* Make it circular */  
}  
  
.content-wrapper {  
  margin: 20px 0;  
}  
  
.cover-image {  
  width: 100%;  
  height: auto;  
  border-radius: 10px;  
}  
  
.image-grid {  
  margin-top: 10px;  
  overflow-x: auto;  
}  
  
.grid-container {  
  display: flex;  
  gap: 10px;  
}  
  
.grid-image {  
  width: 150px;  
  height: auto;  
  border-radius: 10px;  
}  
  
.similar-stories {  
  margin-top: 40px;  
}  
  
.similar-stories h2 {
  font-weight: bold;  
}  
  
/* Bookmark Styles */  
.bookmark-icon {  
  position: absolute; /* Change to absolute for precise positioning */  
  top: 250px; /* Adjust to position it higher or lower */  
  right: 150px; /* Adjust to position it left or right */  
  width: 50px; /* Adjust size */  
  height: 50px; /* Adjust size */  
  background-color: #466543; /* Background color */  
  display: flex;  
  justify-content: center;  
  align-items: center;  
  cursor: pointer;  
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);  
  border-radius: 50%;  
  transition: transform 0.3s ease; /* Transition for hover effect */  
}  
  
.bookmark-icon::after {  
  content: '';           
  width: 55%; /* Adjust size */          
  height: 55%; /* Adjust size */         
  background-image: url('../asset/icon/iconBookmark.png'); /* Path to your icon */    
  background-size: cover; /* Cover the entire area */    
}  
  
.breadcrumb {  
  display: flex; /* Arrange elements in a single row */  
  align-items: center; /* Vertically align elements */  
  margin-bottom: 20px; /* Space between breadcrumb and title */  
  font-size: 16px; /* Font size for breadcrumb */  
  background-color: #f0f5ed; /* Background color for breadcrumb */  
  padding: 25px 100px;  
}  
  
.breadcrumb-item {  
  margin: 0 10px; /* Horizontal spacing between elements */  
  text-decoration: none; /* Remove underline from links */  
}  
  
.breadcrumb-item:hover {  
  border-bottom: 2px solid #222222; /* Underline on hover */  
}  
  
.breadcrumb-separator {  
  margin: 0 10px; /* Horizontal spacing for separator */  
}  
  
.breadcrumb a {  
  text-decoration: none; /* Remove underline from links */  
  color: #222222; /* Link color */  
}  
  
.breadcrumb span {  
  color: #222222; /* Color for non-clickable text */  
}  
</style>  
