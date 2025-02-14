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
                    <select id="sort" v-model="sortOption" @change="handleSortChange">
                        <option value="newest">Newest</option>
                        <option value="popular">Popular</option>
                        <option value="az">A - Z</option>
                        <option value="za">Z - A</option>
                    </select>
                </div>
                <div class="category">
                    <select id="category" v-model="selectedCategory" @change="handleCategoryChange">
                        <option value="">All</option>
                        <option v-for="category in categories" :key="category.id" :value="category.name">
                            {{ category.name }}
                        </option>
                    </select>
                </div>
            </div>
            <div>
                <div class="search-container">
                    <input type="text" v-model="searchQuery" placeholder="Search story" class="search-input"
                        @input="handleSearch" />
                    <i class="fa-solid fa-magnifying-glass search-icon"></i>
                </div>
            </div>
        </div>
        <div v-if="loading" class="text-center py-5">
            Loading...
        </div>
        <div v-else-if="filteredStories.length === 0" class="text-center py-5">
            No stories found
        </div>
        <div v-else class="story-list pt-5">
            <CardLatest
                v-for="story in filteredStories"
                :key="story.id"
                :id="story.id"
                :imageSrc="story.content_images?.[0]?.path ? `${ngrokUrl}/storage/${story.content_images[0].path}` : ''"
                :profilePic="story.user?.image ? `${ngrokUrl}/storage/${story.user.image}` : ''"
                :title="story.title || ''"
                :description="story.content || ''"
                :userName="story.user?.username || ''"
                :createdAt="formatDate(story.created_at)"
                :category="story.category?.name || ''"
            />
        </div>
        <div v-if="filteredStories.length > 0" class="pagination py-5 my-5">
            <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
            <span v-for="page in displayedPages" :key="page">
                <button @click="goToPage(page)" :class="{ active: currentPage === page }">
                    {{ page }}
                </button>
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
    </div>
    <Footer class="mt-5"></Footer>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import CardLatest from '@/components/CardLatest.vue';
import axios from 'axios';
import { ngrokUrl } from '@/store/ngrokConfig';

export default {
    components: {
        CardLatest,
    },
    setup() {
        const authStore = useAuthStore();
        const sortOption = ref('newest');
        const selectedCategory = ref('');
        const searchQuery = ref('');
        const currentPage = ref(1);
        const itemsPerPage = 12;
        const stories = ref([]);
        const totalPages = ref(0);
        const categories = ref([]);
        const loading = ref(false);

        const filteredStories = computed(() => {
            if (!selectedCategory.value) {
                return stories.value;
            }
            return stories.value.filter(story => 
                story.category?.name === selectedCategory.value
            );
        });

        const displayedPages = computed(() => {
            const pages = [];
            const maxDisplayed = 5;
            let start = Math.max(1, currentPage.value - Math.floor(maxDisplayed / 2));
            let end = Math.min(totalPages.value, start + maxDisplayed - 1);

            if (end - start + 1 < maxDisplayed) {
                start = Math.max(1, end - maxDisplayed + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        });

        const fetchStories = async () => {
            if (loading.value) return;
            loading.value = true;
            stories.value = []; // Reset stories before fetching

            try {
                let endpoint = `${ngrokUrl}/api/stories`;
                switch (sortOption.value) {
                    case 'newest':
                        endpoint = `${ngrokUrl}/api/newest`;
                        break;
                    case 'popular':
                        endpoint = `${ngrokUrl}/api/popular`;
                        break;
                    case 'az':
                        endpoint = `${ngrokUrl}/api/az`;
                        break;
                    case 'za':
                        endpoint = `${ngrokUrl}/api/za`;
                        break;
                }

                const params = {
                    page: currentPage.value,
                    per_page: itemsPerPage,
                };

                if (searchQuery.value) {
                    params.search = searchQuery.value;
                }

                const response = await axios.get(endpoint, {
                    headers: {
                        "ngrok-skip-browser-warning": "69420"
                    },
                    params
                });

                if (response.data?.data?.data) {
                    stories.value = response.data.data.data;
                    totalPages.value = response.data.data.last_page;
                }
            } catch (error) {
                console.error('Error fetching stories:', error);
            } finally {
                loading.value = false;
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${ngrokUrl}/api/categories`, {
                    headers: {
                        "ngrok-skip-browser-warning": "69420"
                    }
                });
                categories.value = response.data.data;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        // Watch for changes in filters
        watch([sortOption, searchQuery], () => {
            currentPage.value = 1; // Reset to first page
            fetchStories();
        });

        const handleSortChange = () => {
            currentPage.value = 1;
            fetchStories();
        };

        const handleCategoryChange = () => {
            currentPage.value = 1;
            // Tidak perlu memanggil fetchStories karena kita menggunakan computed property
        };

        const handleSearch = () => {
            currentPage.value = 1;
            fetchStories();
        };

        const goToPage = (page) => {
            currentPage.value = page;
            fetchStories();
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
                fetchStories();
            }
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
                fetchStories();
            }
        };

        const formatDate = (date) => {
            if (!date) return '';
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(date).toLocaleDateString(undefined, options);
        };

        onMounted(async () => {
            await Promise.all([
                authStore.fetchUserData(),
                fetchCategories(),
                fetchStories()
            ]);
        });

        return {
            authStore,
            sortOption,
            selectedCategory,
            searchQuery,
            currentPage,
            totalPages,
            stories,
            filteredStories,
            categories,
            displayedPages,
            loading,
            handleSortChange,
            handleCategoryChange,
            handleSearch,
            goToPage,
            nextPage,
            prevPage,
            formatDate,
            ngrokUrl,
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
    background-color: #f8f9fa;
    /* Warna latar belakang untuk container */
    border-radius: 5px;
    /* Membuat sudut container menjadi melengkung */
}

.breadcrumb {
    display: flex;
    /* Mengatur elemen dalam satu baris */
    align-items: center;
    /* Menyelaraskan elemen secara vertikal */
}

.breadcrumb-item {
    margin: 0 10px;
    /* Menambahkan jarak horizontal antar elemen */
    text-decoration: none;
    /* Menghilangkan garis bawah pada tautan */
}

.breadcrumb-item:hover {
    border-bottom: 2px solid #222222;
    /* Mengatur border bawah saat hover */
}

.breadcrumb-separator {
    margin: 0 10px;
    /* Menambahkan jarak horizontal pada pemisah */
}

.breadcrumb {
    margin-bottom: 20px;
    /* Jarak antara breadcrumb dan judul */
    font-size: 14px;
    /* Ukuran font untuk breadcrumb */
    background-color: #f0f5ed;
    display: flex;
    /* Mengatur elemen dalam satu baris */
    align-items: center;
    /* Menyelaraskan elemen secara vertikal */
}

.breadcrumb a {
    text-decoration: none;
    /* Menghilangkan garis bawah pada link */
    color: #222222;
    /* Warna link */
}

.breadcrumb span {
    color: #222222;
    /* Mengubah warna teks untuk bagian yang tidak bisa diklik */
}

.filters {
    display: flex;
    align-items: center;
    /* Pastikan semua elemen sejajar secara vertikal */
    font-size: 18px;
}

.sort,
.category {
    display: flex;
    align-items: center;
    /* Menjaga label dan dropdown sejajar */
    margin-right: 20px;
    /* Memberikan jarak antara sort dan category */
}

label {
    margin-right: 10px;
    /* Memberikan jarak antara label dan dropdown */
}

.sort select,
.category select {
    border: none;
    /* Menghilangkan border pada dropdown */
    outline: none;
    /* Menghilangkan outline saat fokus */
    padding: 5px;
    /* Menambahkan padding untuk dropdown */
}

.search-container {
    position: relative;
    /* Pastikan kontainer memiliki posisi relatif */
    width: 400px;
    /* Atur lebar kontainer */
}

.search-input {
    padding: 15px;
    padding-right: 40px;
    /* Beri ruang untuk ikon di dalam input */
    width: 100%;
    /* Pastikan input mengisi lebar kontainer */
    border-radius: 10px;
    border: 2px solid #cccccc;
    font-size: 20px;
}

.search-icon {
    position: absolute;
    /* Posisi absolut untuk menempatkan ikon */
    right: 25px;
    /* Jarak dari kanan */
    top: 50%;
    /* Posisikan di tengah vertikal */
    transform: translateY(-50%);
    /* Sesuaikan posisi vertikal */
    pointer-events: none;
    /* Agar klik tidak mengganggu input */
    font-size: 20px;
}

.story-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* Maksimal 3 kolom */
    gap: 20px;
    /* Jarak antar kartu */
}

.pagination {
    display: flex;
    justify-content: center;
    /* Pusatkan pagination */
    margin-top: 20px;
    /* Jarak atas untuk pagination */
}

.pagination button:hover {
    background-color: #31472f;
    /* Warna untuk tombol aktif */
    color: white;
    /* Warna teks untuk tombol aktif */
    transition: all 0.3s ease-in-out;
}

.pagination button {
    padding: 15px 25px;
    /* Padding untuk tombol */
    margin: 0 5px;
    /* Jarak antar tombol */
    border: none;
    /* Menghilangkan border */
    background-color: #f0f5ed;
    /* Warna latar belakang tombol */
    color: black;
    /* Warna teks tombol */
    border-radius: 5px;
    /* Sudut melengkung */
    cursor: pointer;
    /* Kursor pointer saat hover */
    font-size: 20px;
    font-weight: bold;
}

.pagination button:disabled {
    background-color: #cccccc;
    /* Warna latar belakang tombol yang dinonaktifkan */
    cursor: not-allowed;
    /* Kursor tidak diizinkan saat dinonaktifkan */
    pointer-events: none;
    /* Nonaktifkan interaksi dengan tombol */
    opacity: 0.6;
    /* Mengurangi opasitas untuk menunjukkan bahwa tombol dinonaktifkan */
}

.pagination button.active {
    background-color: #31472f;
    /* Warna untuk tombol aktif */
    color: white;
    /* Warna teks untuk tombol aktif */
}
</style>
