<template>
  <Header />
  <div class="profile-container">
    <div class="profile-header">
      <div class="profile-image-awal col-md-4">
        <img :src="user.image || defaultImage" alt="Profile Image" class="img-fluid" />
      </div>
      <div class="profile-info col-md-6">
        <h1 class="h3 fw-bold">{{ user.name }}</h1>
        <p class="fw-medium">{{ user.email }}</p>
        <p class="profile-about">{{ user.about }}</p>
      </div>
      <div class="col-md-2 d-flex align-items-center">
        <button @click="openModal" class="btn btn-profile ms-3">
          Edit Profile
        </button>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <div class="d-flex align-items-center justify-content-between">
          <h2 class="fs-2">Edit Profile</h2>
          <i class="fa-solid fa-xmark close-button ms-5" @click="closeModal"></i>
        </div>
        <div class="modal-body row">
          <div class="profile-section col-md-6">
            <div class="d-flex align-items-center">
              <div class="profile-image mt-3">
                <img :src="imagePreview" alt="Profile Image" class="img-fluid" />
              </div>
              <button @click="selectFile" class="btn btn-change">
                Change Picture
              </button>
            </div>

            <div class="name-section mt-3">
              <label for="name" class="form-label">Name</label>
              <input type="text" v-model="formData.name" class="form-control mb-2 p-3" />

              <label for="email" class="form-label">Email</label>
              <input type="email" v-model="formData.email" class="form-control mb-2 p-3" disabled />

              <label for="about" class="form-label">About Me</label>
              <textarea v-model="formData.about" class="form-control mb-2 p-4"></textarea>
            </div>
          </div>

          <div class="password-section col-md-6">
            <h3 class="">Change Password</h3>
            <label for="old-password" class="form-label mt-5">Old Password</label>
            <input type="password" v-model="formData.oldPassword" placeholder="Enter your old password"
              class="form-control mb-2 p-3" />

            <label for="new-password" class="form-label">New Password</label>
            <input type="password" v-model="formData.newPassword" placeholder="Enter your new password"
              class="form-control mb-2 p-3" />

            <label for="confirm-password" class="form-label">Confirm New Password</label>
            <input type="password" v-model="formData.confirmPassword" placeholder="Re-enter your new password"
              class="form-control mb-2 p-3" />
          </div>
        </div>

        <div class="button mt-3">
          <button @click="closeModal" class="btn btn-cancel me-4">
            Cancel
          </button>
          <button @click="updateProfile" class="btn btn-update">
            Update Profile
          </button>
        </div>
      </div>
    </div>

    <input type="file" ref="fileInput" @change="onFileChange" style="display: none" />

    <!-- Navigation for My Story and Bookmark -->
    <div class="nav-tabs container my-5">
      <button @click="showMyStory" class="tab-button" :class="{ active: isMyStory }">
        My Story
      </button>
      <button @click="showBookmark" class="tab-button" :class="{ active: !isMyStory }">
        Bookmark
      </button>
    </div>

    <div class="d-flex container">
      <div class="write-story col-md-4 me-5">
        <h3 class="mb-3">Write your story</h3>
        <p>
          Share your unique voice with the world – start writing your story
          today!
        </p>
        <nuxt-link to="/addStory" class="btn btn-write-story mt-3">Write Story</nuxt-link>
      </div>

      <div v-if="isMyStory" class="col-md-8">
        <div v-if="stories.length > 0" class="stories-grid">
          <CardUser v-for="story in paginatedStories" :key="story.id"
            :imageSrc="`${ngrokUrl}/storage/${story.content_images[0].path}`"
            :profilePic="`${ngrokUrl}/storage/${story.user.image}`" :title="story.title"
            :description="story.content" :userName="story.user.username" :createdAt="formatDate(story.created_at)"
            :storyId="story.id" />
        </div>

        <div v-else class="story-section text-center">
          <h2>No Stories Yet</h2>
          <p>
            You haven't shared any stories yet. Start your fitness journey
            today!
          </p>
          <div class="illustration">
            <img src="@/asset/profile/story.png" alt="Illustration" class="img-fluid" />
          </div>
        </div>
      </div>

      <div v-else class="col-md-8">
        <div class="bookmark-section text-center">
          <h2>No Bookmarks Yet</h2>
          <p>
            You haven't saved any bookmarks yet. Explore and bookmark your top
            workouts!
          </p>
          <div class="illustration">
            <img src="@/asset/profile/bookmark.png" alt="Bookmark Illustration" class="img-fluid" />
          </div>
        </div>
      </div>
    </div>
    <!-- Navigation for My Story and Bookmark -->

    <!-- Pagination -->
    <div v-if="stories.length > 0" class="pagination py-5 my-5">
      <span v-for="page in totalPages" :key="page">
        <button v-if="
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 1 && page <= currentPage + 1)
        " @click="currentPage = page" :class="{ active: currentPage === page }">
          {{ page }}
        </button>
        <span v-if="page === currentPage + 2"></span>
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/auth";
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import defaultImage from "@/asset/icon/User.png";
import Cookies from "js-cookie";
import CardUser from "~/components/CardUser.vue";
import { ngrokUrl } from "@/store/ngrokConfig";

export default {
  components: {
    CardUser,
  },
  setup() {
    const authStore = useAuthStore();
    const user = ref({});
    const isModalOpen = ref(false);
    const isMyStory = ref(true);
    const stories = ref([]);
    const formData = ref({
      name: "",
      email: "",
      about: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      image: null,
    });
    const currentPage = ref(1);
    const storiesPerPage = 4;

    const imagePreview = computed(() => {
      if (formData.value.image && formData.value.image instanceof File) {
        return URL.createObjectURL(formData.value.image);
      }
      return user.value.image || defaultImage;
    });

    const totalPages = computed(() =>
      Math.ceil(stories.value.length / storiesPerPage)
    );

    const paginatedStories = computed(() => {
      const start = (currentPage.value - 1) * storiesPerPage;
      const end = start + storiesPerPage;
      return stories.value.slice(start, end);
    });

    const userFetchData = async () => {
      try {
        await authStore.fetchUserData();
        user.value = authStore.user || {};
        formData.value.name = user.value.name || "";
        formData.value.email = user.value.email || "";
        formData.value.about = user.value.about || "";
        formData.value.image = user.value.image || "";
        Cookies.set("user", JSON.stringify(user.value));
      } catch (error) {
        console.error("Error fetching user data:", error);
        user.value = {};
        formData.value.name = "";
        formData.value.email = "";
        formData.value.about = "";
        formData.value.image = "";
      }
    };

    const fetchUserStories = async () => {
      try {
        const token = Cookies.get("authToken");

        if (!token) {
          throw new Error("Authorization token not found");
        }

        const response = await axios.get(`${ngrokUrl}/api/stories/my-stories`, {
          headers: {
            "ngrok-skip-browser-warning": "69420",
            Authorization: `Bearer ${token}`,
          },
        });

        const apiStories = response.data.data;
        const userInfo = response.data.user;

        stories.value = apiStories.map((story) => ({
          id: story.id,
          title: story.title,
          content: story.content,
          created_at: story.created_at,
          content_images: story.content_images,
          user: {
            id: userInfo.id,
            name: userInfo.name,
            username: userInfo.username,
            email: userInfo.email,
            image: userInfo.image,
            about: userInfo.about,
          },
        }));

        console.log("User Stories:", stories.value);
      } catch (error) {
        console.error("Error fetching user stories:", error);
      }
    };

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    onMounted(async () => {
      await userFetchData();
      await fetchUserStories();
    });

    const openModal = () => {
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const selectFile = () => {
      document.querySelector("input[type=file]").click();
    };

    const onFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        formData.value.image = file;
      }
    };

    const updateProfile = async () => {
      try {
        const updatedData = {
          name: formData.value.name,
          email: formData.value.email,
          about: formData.value.about,
        };

        await authStore.updateProfile(updatedData);

        if (formData.value.image) {
          const formDataImage = new FormData();
          formDataImage.append("image", formData.value.image);
          await authStore.updateImage(formDataImage);
        }

        if (
          formData.value.newPassword &&
          formData.value.newPassword === formData.value.confirmPassword
        ) {
          const passwordData = {
            old_password: formData.value.oldPassword,
            new_password: formData.value.newPassword,
            confirm_password: formData.value.confirmPassword,
          };
          await authStore.changePassword(passwordData);
        }

        await userFetchData();
        await fetchUserStories();
        closeModal();
        location.reload();
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    };

    const showMyStory = () => {
      isMyStory.value = true;
    };

    const showBookmark = () => {
      isMyStory.value = false;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    return {
      user,
      isModalOpen,
      formData,
      stories,
      openModal,
      closeModal,
      defaultImage,
      imagePreview,
      selectFile,
      onFileChange,
      updateProfile,
      showMyStory,
      showBookmark,
      isMyStory,
      formatDate,
      paginatedStories,
      totalPages,
      currentPage,
      nextPage,
      ngrokUrl,
    };
  },
};
</script>

<style scoped>
.profile-header {
  padding: 100px 150px;
  background-color: #f0f5ed;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-image-awal {
  border-radius: 50%;
  overflow: hidden;
  width: 150px;
  height: 150px;
  margin-right: 20px;
  border: 2px solid #ccc;
}

.profile-image {
  border-radius: 50%;
  overflow: hidden;
  width: 150px;
  height: 150px;
  margin-right: 20px;
  border: 2px solid #ccc;
}

.profile-info {
  flex-grow: 1;
}

.profile-about {
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 5px;
}

.btn-profile {
  background-color: #466543;
  color: white;
  font-size: 20px;
  padding: 10px 30px;
}

.btn-profile:hover {
  background-color: #364934;
}

.nav-tabs {
  display: flex;
  justify-content: start;
  padding: 0;
  border: none;
}

.tab-button {
  background-color: white;
  border: none;
  padding: 20px 30px;
  margin: 0 10px;
  cursor: pointer;
  font-size: 20px;
  border-radius: 5px;
}

.tab-button.active {
  background-color: #f0f5ed;
  color: black;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 85%;
}

.close-button {
  cursor: pointer;
  font-size: 2rem;
}

.btn-change {
  padding: 10px 20px;
  font-size: 20px;
  border: 2px solid #466543;
  color: #466543;
  margin-left: 10px;
}

.btn-cancel {
  padding: 10px 20px;
  font-size: 20px;
  border: 2px solid #466543;
  color: #466543;
}

.btn-cancel:hover {
  border: 2px solid #222222;
  color: #222222;
}

.btn-update {
  padding: 10px 20px;
  font-size: 20px;
  background-color: #466543;
  color: white;
}

.btn-update:hover {
  background-color: #364934;
  color: white;
}

.write-story {
  border: 2px solid #cccccc;
  border-radius: 10px;
  padding: 75px 50px;
  height: fit-content;
  text-align: center;
  position: sticky;
  top: 110px;
}

.story-section {
  padding: 20px;
  background-color: #f9f9f9;
}

.btn-write-story {
  background-color: #466543;
  color: white;
  padding: 10px 20px;
  font-size: 18px;
}

.btn-write-story:hover {
  background-color: #364934;
}

.btn-write-story:active {
  color: white;
}

.bookmark-section {
  padding: 20px;
  background-color: #f9f9f9;
}

.illustration {
  margin-top: 20px;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 600px) {
  .stories-grid {
    grid-template-columns: 1fr;
  }
}

.pagination {
  display: flex;
  margin-top: 20px;
  margin-left: 850px;
}

.pagination button:hover {
  background-color: #31472f;
  color: white;
  transition: all 0.3s ease-in-out;
}

.pagination button {
  padding: 15px 25px;
  margin: 0 5px;
  border: none;
  background-color: #f0f5ed;
  color: black;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
}

.pagination button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.6;
}

.pagination button.active {
  background-color: #31472f;
  color: white;
}
</style>
