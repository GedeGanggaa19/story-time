<template>        
    <Header class="mb-5"></Header>        
    <h1 class="container my-4 fontPlayfair fw-bold">All Stories</h1>        
    <nav class="breadcrumb container-fluid fontDmSans">            
        <a href="/" class="breadcrumb-item"><span>Home</span></a>          
        <span class="breadcrumb-separator">/</span>          
        <a href="allStory" class="breadcrumb-item"><span>All Stories</span></a>            
    </nav>        
    <div class="container fontDmSans">        
        <div class="d-flex align-items-center justify-content-between">        
            <div class="filters my-4">        
                <div class="sort me-5">        
                    <label for="sort">Sort By :</label>        
                    <select id="sort" v-model="sortOption">        
                        <option value="newest">Newest</option>        
                        <option value="popular">Popular</option>        
                        <option value="az">A - Z</option>        
                        <option value="za">Z - A</option>        
                    </select>        
                </div>        
                <div class="category">        
                    <label for="category">Category :</label>        
                    <select id="category" v-model="selectedCategory">        
                        <option value="all">All</option>        
                        <option value="comedy">Comedy</option>        
                        <option value="romance">Romance</option>        
                        <option value="horror">Horror</option>        
                        <option value="adventure">Adventure</option>        
                        <option value="fiction">Fiction</option>        
                        <option value="fantasy">Fantasy</option>        
                        <option value="heartfelt">Heartfelt</option>        
                        <option value="mystery">Mystery</option>        
                    </select>        
                </div>        
            </div>        
            <div>        
                <div class="search-container">        
                    <input type="text" v-model="searchQuery" placeholder="Search story" class="search-input" />        
                    <i class="fa-solid fa-magnifying-glass search-icon"></i>        
                </div>        
            </div>        
        </div>        
        <div class="story-list pt-5">        
            <Card        
                v-for="story in paginatedStories"        
                :key="story.title"        
                :imageSrc="story.image"        
                :profilePic="story.profilePic"        
                :title="story.title"        
                :description="story.description"        
                :userName="story.userName"        
                :createdAt="story.createdAt"        
                :category="story.category"        
            />        
        </div>        
        <div class="pagination py-5 my-5">        
            <span v-for="page in totalPages" :key="page">      
                <button       
                    v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"      
                    @click="currentPage = page"      
                    :class="{ active: currentPage === page }" >      
                    {{ page }}      
                </button>      
                <span v-if="page === currentPage + 2">...</span>      
            </span>      
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>        
        </div>        
    </div>        
    <Footer class="mt-5"></Footer>      
</template>        
        
<script>        
import { ref, computed, onMounted } from 'vue';        
import { useAuthStore } from '@/store/auth';        
import Card from '@/components/Card.vue'; // Import Card.vue        
import imageSrc from '../asset/home/test.jpg'; // Gambar placeholder        
import profilePic from '../asset/home/test.jpg'; // Gambar profil placeholder        
        
export default {        
    components: {        
        Card, // Register Card component        
    },        
    setup() {        
        const authStore = useAuthStore();        
        const sortOption = ref('newest');        
        const selectedCategory = ref('all');        
        const searchQuery = ref('');        
        const currentPage = ref(1);        
        const itemsPerPage = 12; // Jumlah item per halaman diubah menjadi 12        
        
        const stories = ref([        
            {        
                image: imageSrc,        
                profilePic: profilePic,        
                title: 'Gemma',        
                description: 'GOLDEN Gemma was only five minutes away from her parents\' hut...',        
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
            {        
                image: imageSrc,        
                profilePic: profilePic,        
                title: 'Gemma',        
                description: 'GOLDEN Gemma was only five minutes away from her parents\' hut...',        
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
            {        
                image: imageSrc,        
                profilePic: profilePic,        
                title: 'Gemma',        
                description: 'GOLDEN Gemma was only five minutes away from her parents\' hut...',        
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
        
        const filteredStories = computed(() => {        
            return stories.value        
                .filter(story => {        
                    return selectedCategory.value === 'all' || story.category === selectedCategory.value;        
                })        
                .filter(story =>        
                    story.title.toLowerCase().includes(searchQuery.value.toLowerCase())        
                );        
        });        
        
        const totalPages = computed(() => {        
            return Math.ceil(filteredStories.value.length / itemsPerPage);        
        });        
        
        const paginatedStories = computed(() => {        
            const start = (currentPage.value - 1) * itemsPerPage;        
            return filteredStories.value.slice(start, start + itemsPerPage);        
        });        
        
        const nextPage = () => {        
            if (currentPage.value < totalPages.value) {        
                currentPage.value++;        
            }        
        };        
        
        onMounted(async () => {        
            await authStore.fetchUserData(); // Fetch user data on component mount        
        });        
        
        return {        
            authStore,        
            sortOption,        
            selectedCategory,        
            searchQuery,        
            currentPage,        
            totalPages,        
            paginatedStories,        
            nextPage,        
        };        
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

.container-fluid {        
    padding: 25px 100px;      
    max-height: 70px;      
    background-color: #f8f9fa; /* Warna latar belakang untuk container */        
    border-radius: 5px; /* Membuat sudut container menjadi melengkung */        
}        
        
.breadcrumb {        
    display: flex; /* Mengatur elemen dalam satu baris */        
    align-items: center; /* Menyelaraskan elemen secara vertikal */        
}        
        
.breadcrumb-item {        
    margin: 0 10px; /* Menambahkan jarak horizontal antar elemen */        
    text-decoration: none; /* Menghilangkan garis bawah pada tautan */       
}        
        
.breadcrumb-item:hover {        
    border-bottom: 2px solid #222222; /* Mengatur border bawah saat hover */      
}        
        
.breadcrumb-separator {        
    margin: 0 10px; /* Menambahkan jarak horizontal pada pemisah */        
}        
        
.breadcrumb {        
    margin-bottom: 20px; /* Jarak antara breadcrumb dan judul */        
    font-size: 14px; /* Ukuran font untuk breadcrumb */        
    background-color: #f0f5ed;      
    display: flex; /* Mengatur elemen dalam satu baris */        
    align-items: center; /* Menyelaraskan elemen secara vertikal */        
}        
        
.breadcrumb a {        
    text-decoration: none; /* Menghilangkan garis bawah pada link */        
    color: #222222; /* Warna link */        
}        
        
.breadcrumb span {        
    color: #222222; /* Mengubah warna teks untuk bagian yang tidak bisa diklik */        
}        
        
.filters {        
    display: flex;        
    align-items: center; /* Pastikan semua elemen sejajar secara vertikal */        
    font-size: 18px;      
}        
        
.sort, .category {        
    display: flex;        
    align-items: center; /* Menjaga label dan dropdown sejajar */        
    margin-right: 20px; /* Memberikan jarak antara sort dan category */        
}        
        
label {        
    margin-right: 10px; /* Memberikan jarak antara label dan dropdown */        
}        
        
.sort select, .category select {        
    border: none; /* Menghilangkan border pada dropdown */        
    outline: none; /* Menghilangkan outline saat fokus */        
    padding: 5px; /* Menambahkan padding untuk dropdown */        
}        
        
.search-container {        
    position: relative; /* Pastikan kontainer memiliki posisi relatif */        
    width: 400px; /* Atur lebar kontainer */      
}        
        
.search-input {        
    padding: 15px;        
    padding-right: 40px; /* Beri ruang untuk ikon di dalam input */        
    width: 100%; /* Pastikan input mengisi lebar kontainer */        
    border-radius: 10px;        
    border: 2px solid #cccccc;        
    font-size: 20px;        
}        
        
.search-icon {        
    position: absolute; /* Posisi absolut untuk menempatkan ikon */        
    right: 25px; /* Jarak dari kanan */        
    top: 50%; /* Posisikan di tengah vertikal */        
    transform: translateY(-50%); /* Sesuaikan posisi vertikal */        
    pointer-events: none; /* Agar klik tidak mengganggu input */        
    font-size: 20px;      
}        
        
.story-list {        
    display: grid;        
    grid-template-columns: repeat(3, 1fr); /* Maksimal 3 kolom */        
    gap: 20px; /* Jarak antar kartu */        
}        
        
.pagination {        
    display: flex;        
    justify-content: center; /* Pusatkan pagination */        
    margin-top: 20px; /* Jarak atas untuk pagination */        
}        
        
.pagination button:hover {        
    background-color: #31472f; /* Warna untuk tombol aktif */        
    color: white; /* Warna teks untuk tombol aktif */      
    transition: all 0.3s ease-in-out;      
}    
    
.pagination button {        
    padding: 15px 25px; /* Padding untuk tombol */        
    margin: 0 5px; /* Jarak antar tombol */        
    border: none; /* Menghilangkan border */        
    background-color: #f0f5ed; /* Warna latar belakang tombol */        
    color: black; /* Warna teks tombol */        
    border-radius: 5px; /* Sudut melengkung */        
    cursor: pointer; /* Kursor pointer saat hover */   
    font-size: 20px;
    font-weight: bold;     
}        
        
.pagination button:disabled {        
    background-color: #cccccc; /* Warna latar belakang tombol yang dinonaktifkan */        
    cursor: not-allowed; /* Kursor tidak diizinkan saat dinonaktifkan */        
    pointer-events: none; /* Nonaktifkan interaksi dengan tombol */        
    opacity: 0.6; /* Mengurangi opasitas untuk menunjukkan bahwa tombol dinonaktifkan */      
}        
        
.pagination button.active {        
    background-color: #31472f; /* Warna untuk tombol aktif */        
    color: white; /* Warna teks untuk tombol aktif */        
}        
</style>        
