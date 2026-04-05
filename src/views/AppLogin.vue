<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <img
          :src="require('@/assets/image/logo.webp')"
          alt="IOM-ITB"
          class="w-[60px] mr-2"
        />
        <span class="text-2xl font-semibold text-gray-700">IOM-Dashboard</span>
      </div>
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">Masuk menggunakan akun SSO yang terdaftar di Keycloak.</p>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-3">{{ errorMessage }}</p>
        <button
          type="button"
          class="w-full mt-5 px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500"
          :disabled="isLoading"
          @click="login"
        >
          {{ isLoading ? "Memproses..." : "Masuk dengan SSO" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { FETCH_JWT, LOGIN } from "@/store/auth.module";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const isLoading = ref(false);
const errorMessage = ref("");

onMounted(async () => {
  try {
    isLoading.value = true;
    await store.dispatch(FETCH_JWT);
    router.replace("/select");
  } catch {
    isLoading.value = false;
  }
});

async function login() {
  try {
    errorMessage.value = "";
    isLoading.value = true;
    await store.dispatch(LOGIN);
  } catch (error: any) {
    const detail = error?.message ? ` (${error.message})` : "";
    errorMessage.value = `Tidak dapat menghubungkan ke layanan SSO.${detail}`;
    isLoading.value = false;
  }
}
</script>
