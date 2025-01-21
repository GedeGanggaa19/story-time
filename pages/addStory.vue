<template>          
  <Header></Header>            
    <div class="add-story container">          
      <div class="d-flex align-items-center">        
          <i class="fa-solid fa-arrow-left fs-1 me-5"></i>        
          <h1>Write Story</h1>          
      </div>        
      <form @submit.prevent="submitStory">          
        <div class="form-title my-5">          
          <label for="title">Title</label>          
          <input type="text" v-model="title" id="title" placeholder="Enter story title" required />          
        </div>          
          
        <div class="form-category my-5">          
          <label for="category">Category</label>          
          <select v-model="category" id="category" required>          
            <option value="" disabled>Select Category</option>          
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>          
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
              <button type="button" @click="format('bold')" title="Bold"><i class="fa-solid fa-bold"></i></button>    
              <button type="button" @click="format('italic')" title="Italic"><i class="fa-solid fa-italic"></i></button>    
              <button type="button" @click="format('underline')" title="Underline"><i class="fa-solid fa-underline"></i></button>    
              <button type="button" @click="format('createLink', prompt('Enter URL:'))" title="Link"><i class="fa-solid fa-link"></i></button>    
              <button type="button" @click="format('insertOrderedList')" title="Ordered List"><i class="fa-solid fa-list-ol"></i></button>    
              <button type="button" @click="format('insertUnorderedList')" title="Unordered List"><i class="fa-solid fa-list-ul"></i></button>    
            </div>    
            <textarea v-model="content" id="content" placeholder="Enter content here" required></textarea>    
          </div>    
        </div>          
          
        <div class="form-cover-image my-5">          
          <label for="coverImage" class="me-3">Cover Image</label>          
          <div class="cover-image-placeholder">      
            <input type="file" @change="onFileChange" id="coverImage" style="display: none;" ref="fileInput" />          
            <div class="image-box" @click="$refs.fileInput.click()">      
              <i class="fa fa-image"></i>      
              <p>Choose image</p>      
            </div>      
          </div>      
        </div>          
          
        <div class="form-button my-5">          
          <button type="button" @click="cancel" class="btn btnCancel me-5">Cancel</button>          
          <button type="submit" class="btn btnPost">Post Story</button>          
        </div>          
      </form>          
    </div>          
  <Footer></Footer>         
</template>          
    
<script>          
export default {          
  data() {          
    return {          
      title: '',          
      category: '',          
      content: '',          
      coverImage: null,          
      categories: ['Fiction', 'Non-Fiction', 'Poetry', 'Science Fiction', 'Fantasy'], // Example categories          
    };          
  },          
  methods: {          
    onFileChange(event) {          
      this.coverImage = event.target.files[0];          
    },          
    submitStory() {          
      const storyData = {          
        title: this.title,          
        category: this.category,          
        content: this.content,          
        coverImage: this.coverImage,          
      };          
      console.log('Story submitted:', storyData);          
    },          
    cancel() {          
      this.title = '';          
      this.category = '';          
      this.content = '';          
      this.coverImage = null;          
    },    
    format(command, value) {    
      document.execCommand(command, false, value);    
    },    
  },          
};          
</script>          
    
<style scoped>          
.add-story {          
  margin: 0 auto;          
  padding: 20px;            
}          
          
.form-title {             
  font-size: 18px;          
}          
          
.form-title label {          
  display: block;          
  margin-bottom: 15px;          
}          
          
.form-title input {        
  width: 100%;        
  padding: 20px;        
  border-radius: 10px;        
  border: 2px solid #cccccc;        
}        
    
.form-category {                
  font-size: 18px;          
}          
          
.form-category label {          
  display: block;          
  margin-bottom: 15px;          
}          
          
.form-category select {        
  width: 100%;        
  padding: 20px;        
  border-radius: 10px;        
  border: 2px solid #cccccc;        
}    
    
.form-content {                
  font-size: 18px;          
}          
          
.form-content label {          
  display: block;          
  margin-bottom: 15px;          
}          
    
.content-editor {    
  position: relative;    
}    
    
.toolbar {    
  display: flex;    
  margin-bottom: 10px;    
}    
    
.toolbar button, .toolbar select {    
  margin-right: 5px;    
  cursor: pointer;    
  border: none;    
  background: none;    
  font-size: 16px;    
}    
    
.form-content textarea {        
  width: 100%;        
  padding: 20px;        
  border-radius: 10px;        
  border: 2px solid #cccccc;        
}    
    
.form-cover-image {    
  font-size: 18px;    
}    
    
.form-cover-image label {    
  display: block;          
  margin-bottom: 15px;    
}    
    
.cover-image-placeholder {      
  border: 2px dashed #cccccc;      
  border-radius: 10px;      
  padding: 20px;      
  text-align: center;      
  cursor: pointer;      
  width: 450px;    
  height: 350px;    
}      
    
.image-box {      
  display: flex;      
  flex-direction: column;      
  align-items: center;      
  justify-content: center;      
  height: 300px;     
}      
    
.image-box i {      
  font-size: 100px;      
  color: black;      
}      
    
.image-box p {      
  margin-top: 10px;      
  color: black;      
}      
    
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
    
.btnPost {      
  padding: 10px 30px;        
  font-size: 20px;        
  background-color: #466543;        
  color: white;        
}      
    
.btnPost:hover {      
  background-color: #364934;        
  color: white;        
}      
</style>          
