<template>
  <div v-if="activity" class="min-h-screen bg-white">

    <!-- Preview Banner -->
    <div class="bg-yellow-50 border-b border-yellow-200 px-6 py-2 flex items-center justify-between sticky top-0 z-20">
      <span class="text-sm text-yellow-700 font-medium flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        Mode Preview
        <span v-if="activity.status === 'draft'" class="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs">Draft</span>
      </span>
      <button @click="closeWindow" class="text-sm text-yellow-600 hover:underline">Tutup</button>
    </div>

    <!-- Header: Thumbnail + Judul/Tag/Tanggal -->
    <div class="flex flex-col md:flex-row px-[18px] md:px-[70px] pt-8 md:pt-12 gap-8 md:gap-12">

      <!-- Thumbnail -->
      <div class="w-full md:w-[45%] shrink-0 bg-gray-100 aspect-[4/3] md:aspect-auto md:max-h-[340px] overflow-hidden rounded-xl">
        <img
          v-if="activity.image"
          :src="activity.image"
          :alt="activity.title"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
      </div>

      <!-- Judul + Tag + Tanggal -->
      <div class="flex-1 px-8 py-8 flex flex-col justify-center">
        <h1 class="font-[800] text-[28px] md:text-[38px] leading-tight mb-4" style="color: #003793;">
          {{ activity.title }}
        </h1>
        <div v-if="activity.tags?.length > 0" class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="tag in activity.tags"
            :key="tag.id"
            class="px-3 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-75 transition-opacity"
            style="background-color: #003793; color: white;"
          >
            {{ tag.name }}
          </span>
        </div>
        <p class="text-sm text-gray-400">
          Dipublish pada {{ formatDate(activity.date) }}
        </p>
      </div>
    </div>

    <!-- Body: Sidebar kiri + Konten -->
    <div class="flex flex-col md:flex-row px-[18px] md:px-[70px] gap-8 md:gap-10 mt-10 md:mt-12 items-start">

      <!-- Sidebar kiri — sticky di desktop, normal di mobile -->
      <div class="w-full md:w-80 shrink-0 border border-gray-200 rounded-2xl px-6 py-6 shadow-sm md:sticky md:top-[57px]">
        <div class="md:sticky md:top-[41px]">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Artikel ini ditulis oleh</p>
          <ul class="mb-5 space-y-1">
            <template v-if="activity.contributors?.length > 0">
              <li
                v-for="(contributor, index) in activity.contributors"
                :key="index"
                class="text-sm text-gray-600 flex items-center gap-2"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"/>
                {{ contributor }}
              </li>
            </template>
            <li v-else class="text-sm text-gray-600 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"/>
              IOM ITB
            </li>
          </ul>

          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Terakhir diubah pada</p>
          <p class="text-sm text-gray-600 mb-5">{{ formatDate(activity.updatedAt) }}</p>

          <div v-if="activity.tags?.length > 0">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Kategori</p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in activity.tags"
                :key="tag.id"
                class="px-2.5 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-75 transition-opacity"
                style="background-color: #003793; color: white;"
              >
                {{ tag.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Konten artikel -->
      <div class="flex-1 px-6 sm:px-10 min-w-0">
        <div
          v-if="activity.description"
          class="activity-content"
          v-html="activity.description"
        />

        <div class=" mt-8 pt-6">
          <button
            @click="closeWindow"
            class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-full hover:opacity-80 transition-opacity"
            style="background-color: #003793;"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Kembali
          </button>
        </div>
      </div>
    </div>

    <!-- Kegiatan Lainnya -->
    <div class="px-[18px] md:px-[70px] py-10">
      <h2 class="font-[800] text-[20px] mb-6" style="color: #003793;">Kegiatan Lainnya</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          v-for="i in 3"
          :key="i"
          class="rounded-xl overflow-hidden border border-gray-100 shadow-sm"
        >
          <div class="h-[140px] bg-gray-100 animate-pulse"/>
          <div class="p-4">
            <div class="h-4 bg-gray-200 rounded mb-2 w-3/4 animate-pulse"/>
            <div class="h-3 bg-gray-200 rounded mb-3 w-1/2 animate-pulse"/>
            <div class="h-3 bg-gray-100 rounded mb-1 animate-pulse"/>
            <div class="h-3 bg-gray-100 rounded w-4/5 mb-4 animate-pulse"/>
            <div class="h-7 bg-gray-200 rounded-full w-32 animate-pulse"/>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Loading -->
  <div v-else class="min-h-screen bg-white flex items-center justify-center">
    <div class="text-center">
      <div class="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"/>
      <p class="text-sm text-gray-400">Memuat preview...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { GET_ACTIVITY_BY_ID } from '@/store/activity.module';

const route = useRoute();
const store = useStore();
const activity = ref<any>(null);
const activityId = computed(() => Number(route.params.id));

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

const closeWindow = () => window.close();

onMounted(async () => {
  activity.value = await store.dispatch(GET_ACTIVITY_BY_ID, activityId.value);
});
</script>

<style scoped>
.activity-content { font-size: 15px; line-height: 1.85; color: #1f2937; }
.activity-content :deep(p) { margin-bottom: 1.1rem; }
.activity-content :deep(h1) { font-size: 1.6rem; font-weight: 800; margin: 1.8rem 0 0.8rem; color: #003793; }
.activity-content :deep(h2) { font-size: 1.3rem; font-weight: 700; margin: 1.5rem 0 0.6rem; color: #003793; }
.activity-content :deep(h3) { font-size: 1.1rem; font-weight: 700; margin: 1.2rem 0 0.5rem; color: #003793; }
.activity-content :deep(ul),
.activity-content :deep(ol) { padding-left: 1.5rem; margin-bottom: 1rem; }
.activity-content :deep(ul) { list-style-type: disc; }
.activity-content :deep(ol) { list-style-type: decimal; }
.activity-content :deep(li) { margin-bottom: 0.3rem; }
.activity-content :deep(blockquote) {
  border-left: 4px solid #003793;
  padding: 0.5rem 1rem;
  color: #555;
  font-style: italic;
  margin: 1.2rem 0;
  background-color: #f8f9ff;
  border-radius: 0 8px 8px 0;
}
.activity-content :deep(a) { color: #2563eb; text-decoration: underline; cursor: pointer; }
.activity-content :deep(strong) { font-weight: 700; }
.activity-content :deep(em) { font-style: italic; }
.activity-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: inline-block;
}
.activity-content :deep(div[data-youtube-video]) {
  margin: 1.2rem 0;
  border-radius: 10px;
  overflow: hidden;
}
.activity-content :deep(div[data-youtube-video] iframe),
.activity-content :deep(iframe) {
  width: 100%;
  aspect-ratio: 16/9;
  height: auto;
  border: none;
  border-radius: 10px;
  margin: 1.2rem 0;
  display: block;
}
</style>