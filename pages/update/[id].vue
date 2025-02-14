<template>
  <Header></Header>
  <div class="update-story container">
    <div class="d-flex align-items-center">
      <nuxt-link to="/profile">
        <i class="text-dark fa-solid fa-arrow-left fs-1 me-5"></i>
      </nuxt-link>
      <h1>Update Story</h1>
    </div>
    <form @submit.prevent="submitStory">
      <div class="form-title my-5">
        <label for="title">Title</label>
        <input type="text" v-model="title" id="title" placeholder="Enter story title" required />
      </div>

      <div class="form-category my-5">
        <label for="category">Category</label>
        <select v-model="selectedCategory" id="category" required>
          <option value="" disabled selected>Select Category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="form-content my-5">
        <label for="content">Content</label>
        <div class="content-editor">
          <div class="toolbar">
            <select @change="format('formatBlock', $event.target.value)">
              <option value="p">Normal</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </select>
            <button type="button" @click="format('bold')" title="Bold">
              <i class="fa-solid fa-bold ms-3 me-3"></i>
            </button>
            <button type="button" @click="format('italic')" title="Italic">
              <i class="fa-solid fa-italic me-3"></i>
            </button>
            <button type="button" @click="format('underline')" title="Underline">
              <i class="fa-solid fa-underline me-3"></i>
            </button>
            <button type="button" @click="promptForLink" title="Link">
              <i class="fa-solid fa-link me-3"></i>
            </button>
            <button type="button" @click="format('insertOrderedList')" title="Ordered List">
              <i class="fa-solid fa-list-ol me-3"></i>
            </button>
            <button type="button" @click="format('insertUnorderedList')" title="Unordered List">
              <i class="fa-solid fa-list-ul"></i>
            </button>
            <button type="button" @click="undo" title="Undo">
              <i class="fa-solid fa-undo ms-3 me-3"></i>
            </button>
            <button type="button" @click="redo" title="Redo">
              <i class="fa-solid fa-redo me-3"></i>
            </button>
          </div>
          <div class="textarea-wrapper" contenteditable="true" id="content" @input="updateContent($event)"
            placeholder="Enter content here" v-html="content"></div>
        </div>
      </div>

      <div class="form-cover-image my-5">
        <label for="coverImage">Cover Images</label>
        <div class="upload-container">
          <div class="upload-box" @click="triggerFileInput">
            <input type="file" accept="image/*" class="upload-input" @change="onFilesChange" ref="fileInput" multiple />
            <div v-if="!content_images.length" class="upload-content">
              <div class="upload-icon">
                <i class="fa-solid fa-image"></i>
              </div>
              <span class="upload-text">Choose images</span>
            </div>
            <div v-else class="preview-grid">
              <div v-for="(file, index) in content_images" :key="index" class="preview-item">
                <img :src="getImagePreview(file)" :alt="getImageName(file)" class="preview-image" />
                <div class="preview-overlay">
                  <span class="file-name">{{ getImageName(file) }}</span>
                  <button class="remove-btn" @click.stop="removeImage(index)">
                    <i class="fa-solid fa-times"></i>
                  </button>
                </div>
              </div>
              <div v-if="content_images.length < 5" class="add-more" @click.stop="triggerFileInput">
                <i class="fa-solid fa-plus"></i>
                <span>Add More</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-button my-5">
        <button type="button" @click="cancel" class="btn btnCancel me-5">Cancel</button>
        <button type="submit" class="btn btnUpdate">Update Story</button>
      </div>
    </form>
  </div>
  <Footer></Footer>
</template>

<script>
import { useAuthStore } from '../store/auth';
import Cookies from 'js-cookie';
import { ngrokUrl } from '~/store/ngrokConfig';

export default {
  data() {
    return {
      storyId: this.$route.params.id,
      title: '',
      content: '',
      content_images: [],
      categories: [],
      selectedCategory: '',
      history: [],
      historyIndex: -1,
    };
  },
  methods: {
    async fetchStory() {
      try {
        const token = Cookies.get('authToken');
        const response = await fetch(`${ngrokUrl}/api/stories/${this.storyId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': '69420',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const story = data.data;

        this.title = story.title;
        this.selectedCategory = story.category_id;
        this.content = story.content;

        // Convert existing images to a format that matches our needs
        this.content_images = story.content_images.map(image => ({
          id: image.id,
          path: image.path,
          original_name: image.original_name,
          url: `${ngrokUrl}/storage/${image.path}`,
          isExisting: true
        }));

        console.log('Story loaded:', story);
      } catch (error) {
        console.error('Error fetching story:', error);
        alert('Failed to load story. Please refresh the page.');
      }
    },

    async submitStory() {
      try {
        if (!this.title || !this.selectedCategory || !this.content) {
          alert('Please fill in all required fields');
          return;
        }

        const token = Cookies.get('authToken');
        const formData = new FormData();

        // Add basic story data
        formData.append('_method', 'PUT');
        formData.append('title', this.title);
        formData.append('category_id', this.selectedCategory);
        formData.append('content', this.content);

        // Add existing image IDs
        const existingImageIds = this.content_images
          .filter(image => image.isExisting)
          .map(image => image.id);
        formData.append('existing_images', JSON.stringify(existingImageIds));

        // Add new images
        const newImages = this.content_images.filter(image => !image.isExisting);
        newImages.forEach((file, index) => {
          formData.append(`content_images[${index}]`, file);
        });

        const response = await fetch(`${ngrokUrl}/api/stories/${this.storyId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': '69420',
          },
          body: formData
        });

        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (!response.ok) {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = JSON.parse(responseText);
        console.log('Story updated successfully:', result);

        alert('Story has been updated successfully!');
        this.$router.push('/profile');
      } catch (error) {
        console.error('Error updating story:', error);
        alert(`Failed to update story: ${error.message}`);
      }
    },

    triggerFileInput() {
      if (this.content_images.length < 5) {
        this.$refs.fileInput.click();
      } else {
        alert('Maximum 5 images allowed');
      }
    },

    onFilesChange(event) {
      const files = Array.from(event.target.files);
      const totalImages = this.content_images.length + files.length;
      
      if (totalImages > 5) {
        alert('Maximum 5 images allowed');
        return;
      }

      files.forEach(file => {
        const isDuplicate = this.content_images.some(existing => 
          existing.isExisting ? existing.original_name === file.name : existing.name === file.name
        );

        if (!isDuplicate) {
          this.content_images.push(file);
        }
      });

      event.target.value = '';
    },

    removeImage(index) {
      this.content_images.splice(index, 1);
    },

    getImagePreview(image) {
      return image.isExisting ? image.url : URL.createObjectURL(image);
    },

    getImageName(image) {
      return image.isExisting ? image.original_name : image.name;
    },

    format(command, value) {
      document.execCommand(command, false, value);
      this.updateContent({ target: document.getElementById('content') });
    },

    updateContent(event) {
      const newContent = event.target.innerHTML;
      if (this.historyIndex === this.history.length - 1) {
        this.history.push(newContent);
      } else {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(newContent);
      }
      this.historyIndex++;
      this.content = newContent;
    },

    promptForLink() {
      const url = prompt('Enter URL:');
      if (url) {
        this.format('createLink', url);
      }
    },

    undo() {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.content = this.history[this.historyIndex];
        document.getElementById('content').innerHTML = this.content;
      }
    },

    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.content = this.history[this.historyIndex];
        document.getElementById('content').innerHTML = this.content;
      }
    },

    async fetchCategories() {
      try {
        const response = await fetch(`${ngrokUrl}/api/categories`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.categories = data.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to load categories. Please refresh the page.');
      }
    }
  },

  mounted() {
    this.fetchCategories();
    this.fetchStory();
  },

  beforeUnmount() {
    // Clean up any object URLs created for File previews
    this.content_images.forEach(image => {
      if (!image.isExisting) {
        URL.revokeObjectURL(this.getImagePreview(image));
      }
    });
  }
};
</script>

<style scoped>
/* Existing styles */
.fontPlayfair {
  font-family: playfair-display, serif;
}

.fontDmSans {
  font-family: dm-sans, sans-serif;
}

.update-story {
  margin: 0 auto;
  padding: 20px;
}

/* Form styles */
.form-title,
.form-category,
.form-content,
.form-cover-image {
  font-size: 18px;
}

.form-title label,
.form-category label,
.form-content label,
.form-cover-image label {
  display: block;
  margin-bottom: 15px;
}

.form-title input,
.form-category select {
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #cccccc;
}

/* Content editor styles */
.content-editor {
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

.toolbar {
  display: flex;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  padding: 5px;
}

.toolbar select,
.toolbar button {
  margin-right: 5px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 5px;
}

.toolbar button i {
  pointer-events: none;
}

.toolbar button:hover {
  color: #364934;
}

.textarea-wrapper {
  min-height: 150px;
  padding: 10px;
  font-size: 14px;
  border: none;
  outline: none;
  resize: none;
  white-space: pre-wrap;
}

.textarea-wrapper:empty::before {
  content: attr(placeholder);
  color: #999;
  display: block;
}

/* New upload image styles */
.upload-container {
  width: 100%;
  max-width: 800px;
}

.upload-box {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  position: relative;
  min-height: 200px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.upload-box:hover {
  border-color: #466543;
  background: #f0f5ed;
}

.upload-input {
  display: none;
}

.upload-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}

.upload-icon {
  font-size: 48px;
  color: #466543;
  margin-bottom: 10px;
}

.upload-text {
  font-size: 16px;
  color: #666;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  padding: 10px;
}

.preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview-item:hover .preview-overlay {
  opacity: 1;
}

.file-name {
  color: white;
  font-size: 12px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #dc3545;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview-item:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.add-more {
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-more:hover {
  border-color: #466543;
  background: #f0f5ed;
}

.add-more i {
  font-size: 24px;
  color: #466543;
  margin-bottom: 5px;
}

.add-more span {
  font-size: 14px;
  color: #666;
}

/* Button styles */
.form-button {
  display: flex;
}

.btnCancel {
  padding: 10px 30px;
  font-size: 20px;
  border: 2px solid #466543;
  color: #466543;
}

.btnCancel:hover {
  border: 2px solid #222222;
  color: #222222;
}

.btnUpdate {
  padding: 10px 30px;
  font-size: 20px;
  background-color: #466543;
  color: white;
}

.btnUpdate:hover {
  background-color: #364934;
  color: white;
}

.btnUpdate:hover {
  background-color: #364934;
  color: white;
}

/* Responsive styles */
@media screen and (max-width: 768px) {
  .upload-container {
    max-width: 100%;
    padding: 0 15px;
  }

  .upload-box {
    width: 100%;
    height: 300px;
  }

  .upload-icon {
    font-size: 32px;
  }

  .upload-text {
    font-size: 14px;
  }

  .preview-item {
    flex-direction: column;
    text-align: center;
  }

  .preview-image {
    width: 100%;
    height: 200px;
    margin-right: 0;
    margin-bottom: 10px;
  }

  .file-name {
    margin-bottom: 10px;
  }

  .remove-btn {
    width: 100%;
    padding: 8px;
  }
}

@media screen and (max-width: 480px) {
  .upload-box {
    height: 200px;
  }

  .upload-icon {
    font-size: 28px;
  }

  .preview-image {
    height: 150px;
  }
}
</style>