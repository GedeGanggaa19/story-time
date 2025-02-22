<template>
  <div>
    <Header></Header>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
    </div>

    <template v-else-if="story">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb container-fluid fontDmSans">
        <NuxtLink to="/" class="breadcrumb-item"><span>Home</span></NuxtLink>
        <span class="breadcrumb-separator">/</span>
        <NuxtLink to="/stories" class="breadcrumb-item"><span>{{ story.title }}</span></NuxtLink>
      </nav>

      <main class="detail-page container">
        <article class="detail-content">
          <div class="detail-header">
            <p class="date fontDmSans">{{ formatDate(story.created_at) }}</p>
            <h1 class="title my-5 fontPlayfair">{{ story.title }}</h1>
            <div class="author-info mb-5">
              <img :src="`${ngrokUrl}/storage/${story.user.image}`" alt="Profile Picture" class="profile-pic" />
              <p class="author fontDmSans">By {{ story.user.username }}</p>
            </div>
          </div>

          <div class="row content-wrapper mb-5">
            <div class="col-md-4 pe-4">
              <img :src="`${ngrokUrl}/storage/${story.content_images[0].path}`" :alt="story.title"
                class="cover-image" @click="openImageGallery(0)" />
              <div class="image-grid" v-if="story.content_images.length > 1">
                <div class="grid-container">
                  <img v-for="(image, index) in story.content_images.slice(1)" :key="index"
                    :src="`${ngrokUrl}/storage/${image.path}`" :alt="`${story.title} image ${index + 2}`"
                    class="grid-image" @click="openImageGallery(index + 1)" />
                </div>
              </div>
            </div>
            <div class="col-md-8 text-content ps-4 mb-5 fontDmSans">
              <div v-html="story.content"></div>
            </div>
          </div>

          <div class="bookmark-icon" @click="toggleBookmark" :class="{ 'bookmarked': isBookmarked }">
          </div>
        </article>

        <!-- Image Modal -->
        <div class="image-modal" v-if="showModal" @click="closeImageGallery">
          <div class="modal-content" @click.stop>
            <button class="close-button" @click="closeImageGallery">&times;</button>
            <button class="nav-button prev" @click="prevImage" v-if="story.content_images.length > 1">&lt;</button>
            <button class="nav-button next" @click="nextImage" v-if="story.content_images.length > 1">&gt;</button>
            <img :src="`${ngrokUrl}/storage/${story.content_images[currentImageIndex].path}`" 
                :alt="`${story.title} image ${currentImageIndex + 1}`" 
                class="modal-image" />
            <div class="image-counter">{{ currentImageIndex + 1 }} / {{ story.content_images.length }}</div>
          </div>
        </div>

        <!-- Similar Stories Section -->
        <section v-if="similarStories.length" class="similar-stories mt-5">
          <h2 class="fontPlayfair">Similar Stories</h2>
          <hr class="my-5" />
          <div class="d-flex flex-wrap">
            <CardLatest v-for="story in similarStories" :key="story.id" :id="story.id"
              :imageSrc="`${ngrokUrl}/storage/${story.content_images[0].path}`"
              :profilePic="`${ngrokUrl}/storage/${story.user.image}`" :title="story.title" :description="story.content"
              :userName="story.user.username" :createdAt="formatDate(story.created_at)" :category="story.category.name"
              class="mb-5" />
          </div>
        </section>
      </main>
    </template>

    <div v-else class="error-container">
      <p>Story not found</p>
      <NuxtLink to="/" class="btn btn-primary">Back to Home</NuxtLink>
    </div>

    <Footer class="mt-5"></Footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/store/auth";
import { ngrokUrl } from "@/store/ngrokConfig";
import Cookies from "js-cookie";

const route = useRoute();
const authStore = useAuthStore();

const story = ref(null);
const similarStories = ref([]);
const loading = ref(true);
const isBookmarked = ref(false);

// Image Gallery State
const showModal = ref(false);
const currentImageIndex = ref(0);

const openImageGallery = (index) => {
  currentImageIndex.value = index;
  showModal.value = true;
  document.body.style.overflow = 'hidden';
};

const closeImageGallery = () => {
  showModal.value = false;
  document.body.style.overflow = 'auto';
};

const nextImage = () => {
  if (currentImageIndex.value < story.value.content_images.length - 1) {
    currentImageIndex.value++;
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

// Handle keyboard navigation
const handleKeydown = (e) => {
  if (!showModal.value) return;
  
  switch(e.key) {
    case 'ArrowLeft':
      prevImage();
      break;
    case 'ArrowRight':
      nextImage();
      break;
    case 'Escape':
      closeImageGallery();
      break;
  }
};

const checkBookmarkStatus = async () => {
  try {
    const token = Cookies.get("authToken");
    if (!token) return;

    const response = await axios.get(`${ngrokUrl}/api/bookmarks`, {
      headers: {
        "ngrok-skip-browser-warning": "69420",
        Authorization: `Bearer ${token}`,
      },
    });

    const bookmarks = response.data.data;
    isBookmarked.value = bookmarks.some(
      (bookmark) => bookmark.story_id === parseInt(route.params.id)
    );
  } catch (error) {
    console.error("Error checking bookmark status:", error);
  }
};

const fetchStory = async () => {
  try {
    const response = await axios.get(
      `${ngrokUrl}/api/stories/${route.params.id}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    story.value = response.data.data;
    await fetchSimilarStories();
    await checkBookmarkStatus();
  } catch (error) {
    console.error("Error fetching story:", error);
    story.value = null;
  } finally {
    loading.value = false;
  }
};

const fetchSimilarStories = async () => {
  try {
    const response = await axios.get(
      `${ngrokUrl}/api/${route.params.id}/similar`,
      {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );
    similarStories.value = response.data.data.data;
  } catch (error) {
    console.error("Error fetching similar stories:", error);
  }
};

const toggleBookmark = async () => {
  const token = Cookies.get("authToken");
  if (!token) {
    alert("Please login to bookmark stories");
    return;
  }

  try {
    if (isBookmarked.value) {
      // Find bookmark ID and delete it
      const response = await axios.get(`${ngrokUrl}/api/bookmarks`, {
        headers: {
          "ngrok-skip-browser-warning": "69420",
          Authorization: `Bearer ${token}`,
        },
      });
      const bookmark = response.data.data.find(
        (b) => b.story_id === parseInt(route.params.id)
      );
      if (bookmark) {
        await axios.delete(`${ngrokUrl}/api/bookmarks/${bookmark.id}`, {
          headers: {
            "ngrok-skip-browser-warning": "69420",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } else {
      // Add new bookmark
      await axios.post(
        `${ngrokUrl}/api/bookmarks`,
        { story_id: parseInt(route.params.id) },
        {
          headers: {
            "ngrok-skip-browser-warning": "69420",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
    isBookmarked.value = !isBookmarked.value;
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    alert("Error updating bookmark");
  }
};

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

onMounted(() => {
  fetchStory();
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
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
  position: relative;
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
  width: 3%;
  height: 3%;
  border-radius: 50%;
}

.content-wrapper {
  margin: 20px 0;
}

.cover-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.cover-image:hover {
  transform: scale(1.02);
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
  cursor: pointer;
  transition: transform 0.3s ease;
}

.grid-image:hover {
  transform: scale(1.05);
}

/* Image Modal Styles */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90vh;
}

.modal-image {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
  z-index: 1001;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 15px;
  cursor: pointer;
  font-size: 20px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.prev {
  left: -60px;
}

.next {
  right: -60px;
}

.image-counter {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 14px;
}

.similar-stories {
  margin-top: 40px;
}

.similar-stories h2 {
  font-weight: bold;
}

/* Bookmark Styles */
.bookmark-icon {
  position: absolute;
  top: 5px;
  right: 150px;
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

.bookmark-icon::after {
  content: "";
  width: 55%;
  height: 55%;
  background-image: url("@/asset/icon/iconBookmark.png");
  background-size: cover;
}

.card:hover .bookmark-icon {
  transform: translateY(-5px);
}

.bookmark-icon.bookmarked {
  background-color: black;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  background-color: #f0f5ed;
  padding: 25px 100px;
}

.breadcrumb-item {
  margin: 0 10px;
  text-decoration: none;
}

.breadcrumb-item:hover {
  border-bottom: 2px solid #222222;
}

.breadcrumb-separator {
  margin: 0 10px;
}

.breadcrumb a {
  text-decoration: none;
  color: #222222;
}

.breadcrumb span {
  color: #222222;
}

/* Loading Styles */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #466543;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Error Container */
.error-container {
  text-align: center;
  padding: 40px;
}

.error-container p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}
</style>