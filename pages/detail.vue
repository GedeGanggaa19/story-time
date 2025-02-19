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

      <div class="story-detail container">
        <h1 class="story-title">{{ story.title }}</h1>
        <img :src="story.image" alt="Story Image" class="story-image" />
        <p class="story-description">{{ story.description }}</p>
      </div>

      <div v-if="similarStories.length > 0" class="similar-stories container">
        <h2>Similar Stories in {{ story.category.name }}</h2>
        <div class="row">
          <div
            v-for="similar in similarStories"
            :key="similar.id"
            class="col-md-4"
          >
            <div class="card">
              <img
                :src="similar.content_images[0]?.path"
                class="card-img-top"
                alt="Similar Story Image"
              />
              <div class="card-body">
                <h5 class="card-title">{{ similar.title }}</h5>
                <p class="card-text">{{ similar.content }}</p>
                <div class="story-meta">
                  <small class="text-muted">By {{ similar.user.name }}</small>
                  <small class="text-muted"
                    >Category: {{ similar.category.name }}</small
                  >
                </div>
                <NuxtLink
                  :to="`/stories/${similar.id}`"
                  class="btn btn-primary mt-2"
                  >Read More</NuxtLink
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="pagination"
          class="pagination mt-4 d-flex justify-content-center"
        >
          <button
            class="btn btn-outline-primary mx-1"
            :disabled="!pagination.prev_page_url"
            @click="loadPage(pagination.current_page - 1)"
          >
            Previous
          </button>
          <button
            v-for="page in pagination.last_page"
            :key="page"
            class="btn mx-1"
            :class="
              page === pagination.current_page
                ? 'btn-primary'
                : 'btn-outline-primary'
            "
            @click="loadPage(page)"
          >
            {{ page }}
          </button>
          <button
            class="btn btn-outline-primary mx-1"
            :disabled="!pagination.next_page_url"
            @click="loadPage(pagination.current_page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <p class="no-story">Story not found.</p>
    </template>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  data() {
    return {
      story: null,
      similarStories: [],
      pagination: null,
      loading: true,
    };
  },
  methods: {
    async fetchStory() {
      try {
        const response = await axios.get(
          `https://5557-103-100-175-121.ngrok-free.app/api/stories/${this.$route.params.id}`
        );
        this.story = response.data;
        console.log(this.story);
        // Fetch similar stories after we have the story data
        await this.fetchSimilarStories();
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchSimilarStories(page = 1) {
      if (!this.story) return;

      try {
        const response = await axios.get(
          `https://5557-103-100-175-121.ngrok-free.app/api/${this.story.id}/similar`,
          {
            params: { page },
          }
        );

        // Extract the paginated data
        const { data } = response.data;
        this.similarStories = data.data;
        console.log(this.similarStories);

        // Store pagination information
        this.pagination = {
          current_page: data.current_page,
          last_page: data.last_page,
          next_page_url: data.next_page_url,
          prev_page_url: data.prev_page_url,
        };
      } catch (error) {
        console.error("Error fetching similar stories:", error);
      }
    },
    async loadPage(page) {
      await this.fetchSimilarStories(page);
    },
  },
  mounted() {
    this.fetchStory();
  },
  watch: {
    // Add a route watcher to handle navigation between similar stories
    "$route.params.id": {
      handler(newId, oldId) {
        if (newId !== oldId) {
          this.loading = true;
          this.story = null;
          this.similarStories = [];
          this.pagination = null;
          this.fetchStory();
        }
      },
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
  content: "";
  width: 55%; /* Adjust size */
  height: 55%; /* Adjust size */
  background-image: url("../asset/icon/iconBookmark.png"); /* Path to your icon */
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
