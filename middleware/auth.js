// middleware/auth.js
import { useAuthStore } from '@/store/auth';

export default async function (context) {
  const authStore = useAuthStore();
  await authStore.fetchUserData(); // Panggil untuk memeriksa status login saat aplikasi dimuat
}
