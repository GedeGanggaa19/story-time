<template>
  <div class="d-flex">
    <div class="card fontDmSans">
      <div class="image-container">
        <img :src="imageSrc" class="card-img-top card-image" alt="..." />
        <div
          class="bookmark-icon"
          @click="deleteBookmark"
          :class="{ bookmarked: isBookmarked }"
        ></div>
      </div>
      <div class="card-body">
        <h5 class="card-title fw-bold fontdmsans">{{ title }}</h5>
        <p class="card-text description fontDmSans">{{ description }}</p>
        <div class="footer-card">
          <img :src="profilePic" class="profile-pic" alt="Profile Picture" />
          <div
            class="bottom-card justify-content-between d-flex align-items-center"
          >
            <div>
              <p class="mb-0 fontDmSans">{{ userName }}</p>
            </div>
            <div class="d-flex align-items-center">
              <p class="mb-0 me-2 fontDmSans">{{ createdAt }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import Cookies from "js-cookie";

const props = defineProps({
  bookmarkId: {
    type: Number,
    required: true,
  },
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
});

const isBookmarked = ref(true);

const deleteBookmark = async () => {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      alert("Please login to delete bookmark");
      return;
    }

    await axios.delete(
      `https://d823-180-249-187-133.ngrok-free.app/api/bookmarks/${props.bookmarkId}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "69420",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    isBookmarked.value = false;
    window.location.reload();
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    alert("Failed to delete bookmark");
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

.image-container {
  position: relative;
  width: 100%;
  height: 400px;
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

.bookmark-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background-color: #466543;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  margin-top: -30px; /* Setengah dari tinggi ikon (60px / 2) */
  margin-left: -30px; /* Setengah dari lebar ikon (60px / 2) */
  opacity: 0; /* Sembunyikan ikon secara default */
  transition: opacity 0.3s ease; /* Transisi untuk efek muncul */
}

.bookmarked {
  background-color: #000000;
}

.image-container:hover .bookmark-icon {
  opacity: 1; /* Tampilkan ikon saat hover */
}

.bookmark-icon::after {
  content: "";
  width: 55%;
  height: 55%;
  background-image: url("../asset/icon/iconBookmark.png");
  background-size: cover;
}

.bottom-card {
  width: 100%;
}
</style>
