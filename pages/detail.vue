<template>
  <div>
    <Header></Header>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <template v-else-if="story">
      <nav class="breadcrumb container-fluid fontDmSans">
        <a href="/" class="breadcrumb-item"><span>Home</span></a>
        <span class="breadcrumb-separator">/</span>
        <a href="/stories" class="breadcrumb-item"><span>Stories</span></a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">{{ story.title }}</span>
      </nav>

      <main class="detail-page container">
        <article class="detail-content">
          <div class="detail-header">
            <div class="category-tag">{{ story.category.name }}</div>
            <p class="date fontDmSans">{{ formatDate(story.created_at) }}</p>
            <h1 class="title my-5 fontPlayfair">{{ story.title }}</h1>
            <div class="author-info mb-5">
              <img :src="`${ngrokUrl}/storage/${story.user.image}`" alt="Profile Picture" class="profile-pic" />
              <div class="author-details">
                <p class="author-name fontDmSans">{{ story.user.username }}</p>
                <p class="author-date fontDmSans">{{ formatDate(story.created_at) }}</p>
              </div>
            </div>
          </div>

          <div class="content-wrapper mb-5">
            <div class="image-gallery mb-4">
              <div class="main-image">
                <img :src="`${ngrokUrl}/storage/${story.content_images[0].path}`" :alt="story.title" class="cover-image" />
              </div>
              <div v-if="story.content_images.length > 1" class="image-grid">
                <img 
                  v-for="(image, index) in story.content_images.slice(1)" 
                  :key="index"
                  :src="`${ngrokUrl}/storage/${image.path}`"
                  :alt="`${story.title} image ${index + 2}`"
                  class="grid-image"
                  @click="openImageGallery(index + 1)"
                />
              </div>
            </div>

            <div class="story-content fontDmSans" v-html="story.content"></div>
          </div>

          <div class="story-actions">
            <button class="action-button like" @click="toggleLike">
              <i :class="['fas', 'fa-heart', { 'text-danger': isLiked }]"></i>
              <span>{{ story.likes_count || 0 }}</span>
            </button>
            <button class="action-button bookmark" @click="toggleBookmark">
              <i :class="['fas', 'fa-bookmark', { 'text-primary': isBookmarked }]"></i>
            </button>
          </div>
        </article>

        <section v-if="similarStories.length" class="similar-stories mt-5">
          <h2 class="section-title fontPlayfair">Similar Stories</h2>
          <div class="stories-grid">
            <CardLatest
              v-for="story in similarStories"
              :key="story.id"
              :id="story.id"
              :imageSrc="`${ngrokUrl}/storage/${story.content_images[0].path}`"
              :profilePic="`${ngrokUrl}/storage/${story.user.image}`"
              :title="story.title"
              :description="story.content"
              :userName="story.user.username"
              :createdAt="formatDate(story.created_at)"
              :category="story.category.name"
            />
          </div>
        </section>
      </main>
    </template>

    <div v-else class="error-container">
      <p>Story not found</p>
      <router-link to="/" class="btn btn-primary">Back to Home</router-link>
    </div>

    <Footer class="mt-5"></Footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { ngrokUrl } from '@/store/ngrokConfig';
import CardLatest from '@/components/CardLatest.vue';

export default {
  components: {
    CardLatest
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    
    const story = ref(null);
    const similarStories = ref([]);
    const loading = ref(true);
    const isLiked = ref(false);
    const isBookmarked = ref(false);

    const fetchStory = async () => {
      try {
        const response = await axios.get(`${ngrokUrl}/api/stories/${route.params.id}`, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'ngrok-skip-browser-warning': '69420'
          }
        });
        story.value = response.data.data;
        await fetchSimilarStories(story.value.category.id);
      } catch (error) {
        console.error('Error fetching story:', error);
        router.push('/404');
      } finally {
        loading.value = false;
      }
    };

    const fetchSimilarStories = async (categoryId) => {
      try {
        const response = await axios.get(`${ngrokUrl}/api/stories`, {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          },
          params: {
            category: categoryId,
            exclude: route.params.id,
            limit: 3
          }
        });
        similarStories.value = response.data.data.data;
      } catch (error) {
        console.error('Error fetching similar stories:', error);
      }
    };

    const toggleLike = async () => {
      if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
      }

      try {
        await axios.post(`${ngrokUrl}/api/stories/${story.value.id}/like`, {}, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'ngrok-skip-browser-warning': '69420'
          }
        });
        isLiked.value = !isLiked.value;
        story.value.likes_count = isLiked.value ? 
          (story.value.likes_count || 0) + 1 : 
          (story.value.likes_count || 1) - 1;
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    };

    const toggleBookmark = async () => {
      if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
      }

      try {
        await axios.post(`${ngrokUrl}/api/stories/${story.value.id}/bookmark`, {}, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'ngrok-skip-browser-warning': '69420'
          }
        });
        isBookmarked.value = !isBookmarked.value;
      } catch (error) {
        console.error('Error toggling bookmark:', error);
      }
    };

    const formatDate = (date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    };

    onMounted(() => {
      fetchStory();
    });

    return {
      story,
      similarStories,
      loading,
      isLiked,
      isBookmarked,
      toggleLike,
      toggleBookmark,
      formatDate,
      ngrokUrl
    };
  }
};
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
