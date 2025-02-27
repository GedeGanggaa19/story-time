<template>
  <div class="d-flex justify-content-center">
    <div class="card" @click="navigateToDetail">
      <div class="image-container">
        <img :src="imageSrc" class="card-img-top card-image" alt="..." />
        <div
          class="bookmark-icon"
          @click.stop="toggleBookmark"
          :class="{ bookmarked: isBookmarked }"
        ></div>
      </div>
      <div class="card-body">
        <h5 class="card-title fw-bold fontdmSans">{{ title }}</h5>
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
              <p class="mb-0 fontDmSans">{{ createdAt }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { ngrokUrl } from "@/store/ngrokConfig";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

export default {
  props: {
    id: {
      type: [Number, String],
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
    category: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const isBookmarked = ref(false);

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
          (bookmark) => bookmark.story_id === props.id
        );
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };

    const toggleBookmark = async (event) => {
      event.preventDefault();
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          alert("Please login to bookmark stories");
          return;
        }

        if (isBookmarked.value) {
          // Find bookmark ID and delete it
          const response = await axios.get(`${ngrokUrl}/api/bookmarks`, {
            headers: {
              "ngrok-skip-browser-warning": "69420",
              Authorization: `Bearer ${token}`,
            },
          });
          const bookmark = response.data.data.find(
            (b) => b.story_id === props.id
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
            { story_id: props.id },
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

    const navigateToDetail = () => {
      router.push(`/stories/${props.id}`);
    };

    onMounted(() => {
      checkBookmarkStatus();
    });

    return {
      isBookmarked,
      toggleBookmark,
      navigateToDetail,
    };
  },
};
</script>

<style scoped>
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
  border: none;
  width: 300px; /* Adjust width as needed */
  margin-right: 15px;
  margin-bottom: 20px;
  text-align: left;
  transition: background-color 0.3s ease; /* Optional: smooth background transition */
}

.card:hover {
  background-color: rgba(
    255,
    255,
    255,
    0.9
  ); /* Optional: change background on hover */
}

.card:hover .card-title {
  color: #466543; /* Change title color on hover */
}

.card:hover .card-image {
  opacity: 0.5;
}

.card-title {
  padding-left: 0;
  padding-right: 0;
  font-size: 20px; /* Adjust font size as needed */
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
  font-size: 14px; /* Adjust font size as needed */
}

.footer-card {
  display: flex;
  align-items: center;
  font-size: 14px; /* Adjust font size as needed */
}

.profile-pic {
  width: 30px; /* Adjust size as needed */
  height: 30px; /* Adjust size as needed */
  border-radius: 50%;
  margin-right: 10px;
}

.image-container {
  position: relative;
  width: 100%;
  height: 200px; /* Adjust height as needed */
  overflow: hidden;
  border-radius: 10px;
}

.bookmark-icon {
  position: absolute;
  bottom: 20px; /* Adjust position as needed */
  right: 20px; /* Adjust position as needed */
  width: 60px; /* Adjust size as needed */
  height: 60px; /* Adjust size as needed */
  background-color: #466543;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  transition: transform 0.3s ease; /* Transisi untuk efek hover pada bookmark */
}

.card:hover .bookmark-icon {
  transform: translateY(
    -5px
  ); /* Menggerakkan bookmark sedikit ke atas saat di-hover */
}

.bookmark-icon::after {
  content: "";
  width: 55%; /* Adjust size */
  height: 55%; /* Adjust size */
  background-image: url("../asset/icon/iconBookmark.png");
  background-size: cover;
}

.bookmark-icon.bookmarked {
  background-color: black; /* Change color when bookmarked */
}

.bottom-card {
  width: 100%;
}
</style>
