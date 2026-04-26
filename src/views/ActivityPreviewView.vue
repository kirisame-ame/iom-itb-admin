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
    <!-- Header Preview Banner -->
    <div class="bg-yellow-50 border-b border-yellow-200 px-6 py-2 flex items-center justify-between">
      <span class="text-sm text-yellow-700 font-medium">Mode Preview</span>
      <button @click="closeWindow" class="text-sm text-yellow-600 hover:underline">Tutup</button>
    </div>

    <div class="max-w-3xl mx-auto px-6 py-10">
      <!-- Judul -->
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ activity.title }}</h1>
      <p class="text-sm text-gray-400 mb-8">
        {{ formatDate(activity.date) }}
        <span v-if="activity.status === 'draft'" class="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Draft</span>
      </p>

      <!-- Media Carousel -->
      <div v-if="allMedia.length > 0" class="mb-10">
        <div class="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
          <!-- Image -->
          <img
            v-if="allMedia[currentSlide].type === 'image'"
            :src="allMedia[currentSlide].value"
            class="w-full h-full object-cover"
          />
          <!-- YouTube -->
          <iframe
            v-else-if="allMedia[currentSlide].type === 'youtube'"
            :src="getYoutubeEmbed(allMedia[currentSlide].value)"
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />

          <!-- Arrow prev -->
          <button
            v-if="allMedia.length > 1"
            @click="prev"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          <!-- Arrow next -->
          <button
            v-if="allMedia.length > 1"
            @click="next"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        
        <p
          v-if="allMedia[currentSlide]?.caption"
          class="text-center text-xs text-gray-400 mt-2"
        >
          {{ allMedia[currentSlide].caption }}
        </p>

        <!-- Dots -->
        <div v-if="allMedia.length > 1" class="flex justify-center gap-1.5 mt-3">
          <button
            v-for="(_, i) in allMedia"
            :key="i"
            @click="currentSlide = Number(i)"
            :class="currentSlide === i ? 'bg-blue-600 w-4' : 'bg-gray-300 w-1.5'"
            class="h-1.5 rounded-full transition-all"
          />
        </div>
      </div>

      <!-- Konten HTML dari Quill -->
      <div
        v-if="activity.description"
        class="prose prose-gray max-w-none"
        v-html="activity.description"
      />
    </div>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center text-gray-400">
    <p>Memuat preview...</p>
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
  // Thumbnail utama sebagai slide pertama kalau ada
  if (activity.value.image) {
    const thumbnailAlreadyInMedia = media.some((m: any) => m.value === activity.value.image);
    if (!thumbnailAlreadyInMedia) {
      return [{ type: 'image', value: activity.value.image }, ...media];
    }
  }
  return media;
});

const closeWindow = () => window.close();

const prev = () => {
  currentSlide.value = currentSlide.value === 0 ? allMedia.value.length - 1 : currentSlide.value - 1;
};

const next = () => {
  currentSlide.value = currentSlide.value === allMedia.value.length - 1 ? 0 : currentSlide.value + 1;
};

const getYoutubeEmbed = (url: string) => {
  const match = url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
};


onMounted(async () => {
  activity.value = await store.dispatch(GET_ACTIVITY_BY_ID, activityId.value);
});
</script>