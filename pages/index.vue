<template>    
  <Header></Header>    
  <div class="container">    
    <h1 class="h1Judul">  
      <span v-if="isLoggedIn">Hi, {{ user?.username }}.</span>  
    </h1> 
    <h1 class="h1Judul">Welcome to Storytime</h1>    
    <p class="pJudul">    
      The world's most-loved social storytelling platform. Storytime connects a global community of 90 million readers and writers through the power of story.    
    </p>    
    <div class="search-container">    
      <input type="text" placeholder="Search story" class="search-input" />    
      <i class="fa-solid fa-magnifying-glass search-icon"></i>    
    </div>    
    <div class="imgAwal">    
      <img src="../asset/home/imgJudul.png" alt="imgJudul" class="imgJudul" />    
    </div>    
    
    <!-- Latest Stories Section -->    
    <div class="latest-stories">    
      <div class="latest-judul justify-content-between align-items-center">    
        <h2 class="h2Judul">Latest Story</h2> 
        <nuxt-link class="d-flex explore text-decoration-none" to="/allStory">     
          <p class="pExplore me-2">Explore More</p>     
          <i class="fa-solid fa-arrow-right fs-3"></i>  
        </nuxt-link>  
      </div>    
      <div class="custom-hr">    
        <hr>    
      </div>    
      <div class="stories-grid">    
        <CardLatest    
          v-for="(story, index) in stories"    
          :key="index"    
          :imageSrc="story.image"    
          :profilePic="story.profilePic"    
          :title="story.title"    
          :description="story.description"    
          :userName="story.userName"    
          :createdAt="story.createdAt"    
          :category="story.category"    
        />    
      </div>    
    </div>    
  
    <!-- Comedy Section -->    
    <div class="container-fluid comedy-section">    
      <div class="comedy-judul justify-content-between align-items-center">    
        <h2 class="h2Judul">Comedy</h2>    
        <div class="d-flex explore">   
          <p class="pExplore me-2">Explore More</p>   
          <i class="fa-solid fa-arrow-right fs-3"></i>
        </div>    
      </div>    
      <div class="custom-hr">    
        <hr>    
      </div>    
      <div class="row">    
        <div class="col-lg-8 col-md-6">    
          <CardBig    
            v-for="(comedy, index) in comedies"    
            :key="index"    
            :imageSrc="comedy.image"    
            :profilePic="comedy.profilePic"    
            :title="comedy.title"    
            :description="comedy.description"    
            :userName="comedy.userName"    
            :createdAt="comedy.createdAt"    
            :category="comedy.category"    
          />    
        </div>    
        <div class="col-lg-4 col-md-6 ">    
          <div class="d-flex flex-column">    
            <CardSmall    
              v-for="(smallComedy, index) in smallComedies"    
              :key="index"    
              :imageSrc="smallComedy.image"    
              :profilePic="smallComedy.profilePic"    
              :title="smallComedy.title"    
              :description="smallComedy.description"    
              :userName="smallComedy.userName"    
              :createdAt="smallComedy.createdAt"    
              :category="smallComedy.category"    
            />    
          </div>    
        </div>    
      </div>    
    </div>    
  
    <!-- Romance Section -->      
    <div class="romance-section">      
      <div class="romance-judul justify-content-between align-items-center">      
        <h2 class="h2Judul">Romance</h2>      
        <div class="d-flex explore">   
          <p class="pExplore me-2">Explore More</p>   
          <i class="fa-solid fa-arrow-right fs-3"></i>
        </div>     
      </div>      
      <div class="custom-hr">      
        <hr>      
      </div>      
      <div class="row">      
        <div class="col-lg-4 col-md-6" v-for="(romance, index) in romances" :key="index">      
          <Card      
            :imageSrc="romance.image"      
            :profilePic="romance.profilePic"      
            :title="romance.title"      
            :description="romance.description"      
            :userName="romance.userName"      
            :createdAt="romance.createdAt"     
          />      
        </div>      
      </div>      
    </div>      
    
    <!-- Horror Section -->    
    <div class="container-fluid horror-section">    
      <div class="horror-judul justify-content-between align-items-center">    
        <h2 class="h2Judul">Horror</h2>    
        <div class="d-flex explore">   
          <p class="pExplore me-2">Explore More</p>   
          <i class="fa-solid fa-arrow-right fs-3"></i>
        </div> 
      </div>    
      <div class="custom-hr">    
        <hr>    
      </div>    
      <div class="row">    
        <div class="col-lg-8 col-md-6">    
          <CardBig    
            v-for="(horror, index) in horrors.slice(0, 1)"    
            :key="index"    
            :imageSrc="horror.image"    
            :profilePic="horror.profilePic"    
            :title="horror.title"    
            :description="horror.description"    
            :userName="horror.userName"    
            :createdAt="horror.createdAt"    
            :category="horror.category"    
          />    
        </div>    
        <div class="col-lg-4 col-md-6">    
          <div class="d-flex flex-column card-small">    
            <CardSmall    
              v-for="(smallHorror, index) in smallHorrors"    
              :key="index"    
              :imageSrc="smallHorror.image"    
              :profilePic="smallHorror.profilePic"    
              :title="smallHorror.title"    
              :description="smallHorror.description"    
              :userName="smallHorror.userName"    
              :createdAt="smallHorror.createdAt"    
              :category="smallHorror.category"    
            />    
          </div>    
        </div>    
      </div>    
    </div>    

    <!-- More Categories Section -->  
    <div class="more-categories">  
      <h2 class="h2Judul">More Categories</h2>  
      <div class="custom-hr">    
        <hr>
      </div>
      <div class="categories-container">  
        <button class="category-button fontDmSans">Adventure</button>  
        <button class="category-button fontDmSans">Fiction</button>  
        <button class="category-button fontDmSans">Fantasy</button>  
        <button class="category-button fontDmSans">Drama</button>  
        <button class="category-button fontDmSans">Heartfelt</button>  
        <button class="category-button fontDmSans">Mystery</button>  
      </div>  
    </div>  

    <!-- Login Modal -->    
    <div v-if="showLoginModal" class="modal">    
      <div class="modal-content">    
        <img src="../asset/icon/iconSuccess.png" alt="Success" class="checkmark me-2" />    
        <p class="modal-message my-auto">You have successfully logged in.</p>    
        <i class="fa-solid fa-xmark close ms-5" @click="closeLoginModal"></i>    
      </div>    
    </div>    
    
    <!-- Register Modal -->    
    <div v-if="showRegisterModal" class="modal">    
      <div class="modal-content">    
        <img src="../asset/icon/iconSuccess.png" alt="Success" class="checkmark me-2" />    
        <p class="modal-message my-auto">You have successfully registered.</p>    
        <i class="fa-solid fa-xmark close ms-5" @click="closeRegisterModal"></i>    
      </div>    
    </div>    
  </div>
  <Footer></Footer>    
</template>    
    
<script>    
import { useAuthStore } from '@/store/auth';  
import { ref, onMounted, computed } from 'vue';  
import Cookies from 'js-cookie'; // Import js-cookie for cookie management  
import Card from '@/components/Card.vue'; // Import Card.vue    
import CardBig from '@/components/CardBig.vue'; // Import CardBig.vue    
import CardSmall from '@/components/CardSmall.vue'; // Import CardSmall.vue  
import CardLatest from '@/components/CardLatest.vue';  
import imageSrc from '../asset/home/test.jpg';    
import profilePic from '../asset/home/test.jpg';    
    
export default {    
  components: {    
    Card, // Register Card component    
    CardBig, // Register CardBig component    
    CardSmall, // Register CardSmall component    
    CardLatest,
  },    
  setup() {    
    const authStore = useAuthStore();  
    const user = ref(null); // State untuk menyimpan data pengguna  
    const isLoggedIn = computed(() => {  
      return Cookies.get('isLoggedIn') === 'true'; // Cek status login dari cookies  
    });  
  
    // Ambil data pengguna dari cookies  
    const getUserData = () => {  
      const userData = Cookies.get('user');  
      return userData ? JSON.parse(userData) : null;  
    };  
  
    onMounted(() => {  
      user.value = getUserData(); // Ambil data pengguna saat komponen dimuat  
      authStore.fetchUserData(); // Ambil data pengguna dari store jika diperlukan  
    });    
    const showLoginModal = ref(false);    
    const showRegisterModal = ref(false);    
    const stories = ref([    
      {    
        image: imageSrc,    
        profilePic: profilePic,    
        title: 'Gemma',    
        description: 'GOLDEN Gemma was only five minutes away from her parents\' hut... Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint perferendis tempora voluptatibus doloremque aut culpa repellat earum eligendi vel? Eum quasi consequuntur magni quidem dignissimos! Voluptates illo voluptatum facilis minus.',    
        userName: 'User1',    
        createdAt: '2023-07-17',    
        category: 'Adventure',    
      },    
      {    
        image: imageSrc,    
        profilePic: profilePic,    
        title: 'Harry Potter and the Goblet of Fire',    
        description: 'Harry Potter and the Goblet of Fire is a fantasy novel written by J.K. Rowling...',    
        userName: 'User2',    
        createdAt: '2023-07-17',    
        category: 'Fantasy',    
      },    
      {    
        image: imageSrc,    
        profilePic: profilePic,    
        title: 'Harry Potter and the Chamber of Secrets',    
        description: 'Harry Potter and the Chamber of Secrets is a fantasy novel written by J.K. Rowling...',    
        userName: 'User3',    
        createdAt: '2023-07-17',    
        category: 'Fantasy',    
      },    
      {    
        image: imageSrc,    
        profilePic: profilePic,    
        title: 'The Great Gatsby',    
        description: 'A novel about the American dream and the roaring twenties.',    
        userName: 'User4',    
        createdAt: '2023-07-18',    
        category: 'Classic',    
      },    
      {    
        image: imageSrc,    
        profilePic: profilePic,    
        title: 'To Kill a Mockingbird',    
        description: 'A novel about racial injustice in the Deep South.',    
        userName: 'User5',    
        createdAt: '2023-07-19',    
        category: 'Classic',    
      },    
      {    
        image: imageSrc,    
        profilePic: profilePic,    
        title: '1984',    
        description: 'A dystopian novel about totalitarianism and surveillance.',    
        userName: 'User6',    
        createdAt: '2023-07-20',    
        category: 'Dystopian',    
      },    
    ]);    
    
    const comedies = ref([    
      {    
        image: imageSrc,    
        profilePic: profilePic,    
        title: "Guardians of the Galaxy Vol. 3",    
        description: "At their new headquarters on Knowhere, the Guardians of the Galaxy are attacked by Adam Warlock...Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti ducimus officia ab, debitis eligendi enim incidunt error ipsum quisquam nesciunt nisi, nobis at corporis! Libero quia velit nemo corrupti blanditiis.",    
        userName: "Juliana Putra",    
        createdAt: "15 May 2023",    
      },    
    ]);    
    
    const smallComedies = ref([    
      {    
        image: imageSrc,    
        profilePic: profilePic,    
        title: "Doctor Strange",    
        description: "Doctor Strange is Dr. Stephen Strange.",    
        userName: "Langgam",    
        createdAt: "11 May 2023", 
      },    
      {    
        image: imageSrc,    
        profilePic: profilePic,    
        title: "Si Kancil",    
        description: "A beloved character in Indonesian folklore with humorous tales.Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti ducimus officia ab, debitis eligendi enim incidunt error ipsum quisquam nesciunt nisi, nobis at corporis! Libero quia velit nemo corrupti blanditiis.",    
        userName: "Fahaladin",    
        createdAt: "06 December 2022", 
      },    
    ]);    
  
    // New data for Romance stories  
    const romances = ref([  
      {  
        image: imageSrc,  
        profilePic: profilePic,  
        title: "Love in the Time of Cholera",  
        description: "A story of love that spans decades.",  
        userName: "User7",  
        createdAt: "2023-08-01",  
      },  
      {  
        image: imageSrc,  
        profilePic: profilePic,  
        title: "Pride and Prejudice",  
        description: "A classic tale of love and misunderstanding.",  
        userName: "User8",  
        createdAt: "2023-08-02",  
      },  
      {  
        image: imageSrc,  
        profilePic: profilePic,  
        title: "The Notebook",  
        description: "A love story that never fades.",  
        userName: "User9",  
        createdAt: "2023-08-03", 
      },  
    ]);  
  
    // New data for Horror stories  
    const horrors = ref([  
      {  
        image: imageSrc,  
        profilePic: profilePic,  
        title: "The Shining",  
        description: "A chilling tale of isolation and madness.",  
        userName: "User10",  
        createdAt: "2023-09-01",  
      },  
    ]);  
  
    const smallHorrors = ref([  
      {  
        image: imageSrc,  
        profilePic: profilePic,  
        title: "The Haunting of Hill House",  
        description: "A story about a haunted house and its inhabitants.",  
        userName: "User11",  
        createdAt: "2023-09-04",  
      },  
      {  
        image: imageSrc,  
        profilePic: profilePic,  
        title: "Bird Box",  
        description: "A post-apocalyptic thriller about survival.",  
        userName: "User12",  
        createdAt: "2023-09-05",
      },  
    ]);  
  
    const showSuccessModal = () => {    
      if (authStore.isLoggedIn) {    
        showLoginModal.value = true;    
      } else if (authStore.isRegistered) {    
        showRegisterModal.value = true;    
      }    
    
      // Optional: Automatically close the modal after 10 seconds    
      setTimeout(() => {    
        closeLoginModal();    
        closeRegisterModal();    
      }, 10000);    
    };    
    
    onMounted(async () => {    
      await authStore.fetchUserData(); // Fetch user data on component mount    
      showSuccessModal();    
    });    
    
    const closeLoginModal = () => {    
      showLoginModal.value = false;    
    };    
    
    const closeRegisterModal = () => {    
      showRegisterModal.value = false;    
    };    
    
    return { 
      user,  
      isLoggedIn,  
      authStore, 
      showLoginModal, 
      showRegisterModal, 
      closeLoginModal, 
      closeRegisterModal, 
      stories, 
      comedies, 
      smallComedies, 
      romances, 
      horrors, 
      smallHorrors };    
  },    
  head() {    
    return {    
      title: 'Welcome to Storytime',    
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

.container {    
  text-align: center;    
  padding: 50px;    
}    
    
.h1Judul {    
  margin-top: 20px;    
  font-family: playfair-display, serif;    
  font-size: 50px;    
  font-weight: 800;    
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);    
}    
    
.pJudul {    
  margin-top: 20px;    
  font-size: 20px;    
  font-family: dm-sans, sans-serif;    
}    
    
.search-container {    
  margin: auto;    
  position: relative;    
  margin-top: 30px;    
  width: 800px;    
}    
    
.search-input {    
  padding: 15px;    
  width: 100%;    
  border-radius: 10px;    
  border: 2px solid #cccccc;    
}    
    
.search-icon {    
  position: absolute;    
  right: 15px;    
  top: 50%;    
  transform: translateY(-50%);    
}    
    
.imgAwal {    
  margin-top: 40px;    
}    
    
.imgJudul {    
  width: 650px;    
  height: auto;    
}    
    
/* Latest Stories Styles */    
.latest-stories {    
  margin-top: 100px;    
}    
  
.h2Judul {    
  font-family: playfair-display, serif; 
  font-weight: bold;   
}

.explore {  
  font-size: 18px;  
  position: relative; /* Untuk posisi border */  
  cursor: pointer; /* Menunjukkan bahwa ini dapat di-hover */  
  color: black;
}  
  
.explore::after {  
  content: ''; /* Membuat elemen pseudo */  
  position: absolute; /* Mengatur posisi */  
  left: 0; /* Mengatur posisi kiri */  
  bottom: 0; /* Mengatur posisi bawah */  
  width: 100%; /* Lebar border sama dengan teks */  
  height: 1px; /* Tinggi border */  
  background-color: transparent; /* Warna border awal */  
  transition: background-color 0.3s ease; /* Transisi untuk efek halus */  
}  
  
.explore:hover::after {  
  background-color: #31472f; 
}  

.explore:hover {
  color: #31472f;
}

.latest-judul {    
  display: flex;   
}    
    
.custom-hr {    
  margin-top: 20px;    
  margin-bottom: 40px;    
}    
    
.stories-grid {    
  display: flex;    
  overflow-x: auto;    
  overflow-y: hidden;    
  scrollbar-width: none;     
  scroll-snap-type: x mandatory;    
}    
    
.story-card {    
  background: #f9f9f9;    
  border-radius: 10px;    
  width: 350px;    
  text-align: left;    
  margin-right: 20px;    
  scroll-snap-align: start;    
  flex: 0 0 auto;    
}    
    
/* Comedy Section Styles */    
.comedy-section {    
  margin: 100px 0px;    
}    
    
.comedy-judul {    
  display: flex;    
  justify-content: space-between;    
  align-items: center;    
}    
    
.comedy-grid {    
  display: flex;    
  justify-content: space-between; /* Aligns the columns */    
  margin-top: 20px; /* Adds space between title and cards */    
}    

  /* Romance Section Styles */ 
.romance-section {
  margin-top: 100px;
}        

.romance-judul {      
  display: flex;      
  justify-content: space-between;      
  align-items: center;      
}      
  
.romance-grid {      
  display: grid;      
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Adjust the minmax value as needed */      
  gap: 20px; /* Space between cards */      
  margin-top: 20px; /* Adds space between title and cards */      
}      

/* Horror Section Styles */  
.horror-section {    
  margin: 100px 0px;   
}    
    
.horror-judul {    
  display: flex;    
  justify-content: space-between;    
  align-items: center;    
}    
    
.horror-grid {    
  display: flex;    
  justify-content: space-between; /* Aligns the columns */    
  margin-top: 20px; /* Adds space between title and cards */    
}    

/* More Categories Section Styles */  
.more-categories {  
  margin: 100px 0px;  
  text-align: left;  
}  
  
.categories-container {  
  display: flex;  
  justify-content: start;  
  flex-wrap: wrap;  
  gap: 20px; /* Space between buttons */  
}  
  
.category-button {  
  background-color: #f0f5ed;   
  border: none;  
  border-radius: 5px; 
  padding: 4% 4%;  
  font-size: 24px;  
  color: #31472f;
  cursor: pointer;  
  transition: background-color 0.3s;
  font-weight: medium;  
}  
  
.category-button:hover {  
  background-color: #d5e6d4; 
  color: #222222;
}  
    
/* Modal Styles */    
.modal {    
  display: flex;    
  justify-content: center;    
  align-items: start;    
  position: fixed;    
  z-index: 1;    
  left: 0;    
  top: 0;    
  width: 100%;    
  height: 100%;    
  overflow: auto;    
}    
    
.modal-content {    
  display: flex; /* Use flexbox for alignment */    
  flex-direction: row; /* Stack items vertically */    
  align-items: center; /* Center items horizontally */    
  justify-content: center;    
  background-color: #ffffff; /* White background */    
  margin: 2% auto;    
  padding: 20px;    
  border: none; /* No border */    
  max-width: 400px; /* Adjusted for a more compact modal */    
  text-align: center;    
  border-radius: 10px; /* Rounded corners */    
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow for depth */    
}    
    
.checkmark {    
  width: 10%;    
  height: auto;    
}    
    
.modal-message {    
  font-size: 15px; /* Adjust font size for better readability */    
  color: #333; /* Darker text for contrast */    
  font-weight: 600;    
}    
    
.close {    
  color: #aaa;    
  font-size: 28px;    
  font-weight: bold;    
}    
    
.close:hover,    
.close:focus {    
  color: black;    
  text-decoration: none;    
  cursor: pointer;    
} 

/* Style Card */

.card-small {
  margin-left: 20px;
}


</style>    
