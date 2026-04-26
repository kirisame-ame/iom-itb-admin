<style>
.prose a {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
}
.prose a:hover {
  color: #1d4ed8;
}
</style>

<template>
  <div v-if="activity" class="min-h-screen bg-white">

    <!-- Preview Banner -->
    <div class="bg-yellow-50 border-b border-yellow-200 px-6 py-2 flex items-center justify-between">
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

    <!-- Konten utama — style iom-itb-app -->
    <div class="bg-white pt-[10px] pb-[32px] px-[18px] md:px-[70px]">

      <!-- Judul -->
      <h2 class="font-[800] text-[32px] md:text-[50px] leading-tight py-[16px] md:text-start"
          style="color: #003793;">
        {{ activity.title }}
      </h2>

      <p class="font-[500] text-[14px] md:text-[16px] opacity-60 mb-[24px]" style="color: #003793;">
        {{ formatDate(activity.date) }}
      </p>

      <!-- Media Carousel -->
      <div v-if="allMedia.length > 0" class="mb-[32px] max-w-[600px] mx-auto">
        <div class="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden">
          <!-- Image -->
          <img
            v-if="allMedia[currentSlide]?.type === 'image'"
            :src="allMedia[currentSlide]?.value"
            :alt="allMedia[currentSlide]?.caption || activity.title"
            class="w-full h-full object-cover"
          />
          <!-- YouTube embed -->
          <iframe
            v-else-if="allMedia[currentSlide]?.type === 'youtube'"
            :src="getYoutubeEmbed(allMedia[currentSlide]?.value)"
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />

          <!-- Arrow prev -->
          <button
            v-if="allMedia.length > 1"
            @click="prev"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          <!-- Arrow next -->
          <button
            v-if="allMedia.length > 1"
            @click="next"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <!-- Caption -->
        <p v-if="allMedia[currentSlide]?.caption" class="text-center text-xs text-gray-400 mt-2">
          {{ allMedia[currentSlide].caption }}
        </p>

        <!-- Dots -->
        <div v-if="allMedia.length > 1" class="flex justify-center gap-2 mt-3">
          <button
            v-for="(_, i) in allMedia"
            :key="i"
            @click="currentSlide = Number(i)"
            :class="currentSlide === Number(i) ? 'w-4' : 'w-2'"
            class="h-2 rounded-full transition-all"
            :style="currentSlide === Number(i) ? 'background-color: #003793' : 'background-color: #d1d5db'"
          />
        </div>
      </div>

      <!-- Konten HTML -->
      <div
        v-if="activity.description"
        class="activity-content font-[500] text-[14px] md:text-[16px] mb-[24px]"
        style="color: #003793;"
        v-html="activity.description"
      />

      <!-- Tombol kembali dummy -->
      <button
        @click="closeWindow"
        class="inline-flex items-center gap-2 px-4 py-2 text-[16px] font-medium text-white rounded-full hover:opacity-80 transition-opacity"
        style="background-color: #003793;"
      >
        <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Kembali
      </button>
    </div>

    <!-- Kegiatan Lainnya (dummy) -->
    <div class="bg-white p-[16px] md:p-[24px] px-[18px] md:px-[70px] border-t border-gray-100">
      <h2 class="font-[800] text-[32px] md:text-[50px] leading-tight py-[16px]" style="color: #003793;">
        Kegiatan Lainnya
      </h2>
      <div class="flex overflow-x-auto gap-4 snap-x pb-2">
        <div
          v-for="i in 3"
          :key="i"
          class="max-w-[300px] min-w-[300px] rounded-lg shadow snap-center flex flex-col justify-between"
          style="background-color: #003793;"
        >
          <div class="h-[200px] rounded-t-lg bg-gray-300 animate-pulse"/>
          <div class="p-5">
            <div class="h-6 bg-white/20 rounded mb-2 w-3/4"/>
            <div class="h-4 bg-white/20 rounded mb-3 w-1/2"/>
            <div class="h-3 bg-white/20 rounded mb-1"/>
            <div class="h-3 bg-white/20 rounded w-4/5"/>
          </div>
          <div class="mx-3 mb-4 h-8 bg-white rounded-full w-36"/>
        </div>
      </div>
    </div>

  </div>

  <div v-else class="min-h-screen flex items-center justify-center text-gray-400">
    <div class="text-center">
      <div class="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"/>
      <p class="text-sm">Memuat preview...</p>
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
const currentSlide = ref(0);
const activityId = computed(() => Number(route.params.id));

const allMedia = computed(() => {
  if (!activity.value) return [];
  const media = activity.value.media || [];
  if (activity.value.image) {
    const alreadyIn = media.some((m: any) => m.value === activity.value.image);
    if (!alreadyIn) {
      return [{ type: 'image', value: activity.value.image, caption: null }, ...media];
    }
  }
  return media;
});

const prev = () => {
  if (currentSlide.value > 0) currentSlide.value--;
};

const next = () => {
  if (currentSlide.value < allMedia.value.length - 1) currentSlide.value++;
};

const getYoutubeEmbed = (url: string) => {
  const match = url?.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
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
.activity-content :deep(p) { margin-bottom: 1rem; line-height: 1.7; }
.activity-content :deep(h1),
.activity-content :deep(h2),
.activity-content :deep(h3) { font-weight: 700; margin-bottom: 0.75rem; margin-top: 1.5rem; }
.activity-content :deep(h1) { font-size: 1.75rem; }
.activity-content :deep(h2) { font-size: 1.5rem; }
.activity-content :deep(h3) { font-size: 1.25rem; }
.activity-content :deep(ul),
.activity-content :deep(ol) { padding-left: 1.5rem; margin-bottom: 1rem; }
.activity-content :deep(ul) { list-style-type: disc; }
.activity-content :deep(ol) { list-style-type: decimal; }
.activity-content :deep(li) { margin-bottom: 0.25rem; }
.activity-content :deep(blockquote) {
  border-left: 4px solid #003793;
  padding-left: 1rem;
  color: #666;
  font-style: italic;
  margin: 1rem 0;
}
.activity-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
}
.activity-content :deep(strong) { font-weight: 700; }
.activity-content :deep(em) { font-style: italic; }
</style>