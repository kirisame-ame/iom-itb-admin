<style scoped>
.tooltip-wrapper {
  position: relative;
}
.tooltip-wrapper:hover .tooltip-text {
  visibility: visible !important;
  opacity: 1 !important;
}
.tooltip-text {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s;
}
</style>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="pb-4">
        <h1 class="text-3xl font-bold text-blue-900 tracking-tight">Kegiatan</h1>
        <p class="text-sm text-slate-500 mt-2">Kelola dan tinjau semua post kegiatan</p>
      </div>
      <button
        @click="createNew"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Tulis Kegiatan
      </button>
    </div>

    <!-- Filter, Search, Sort -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <!-- Filter Status -->
      <div class="flex rounded-md overflow-hidden border border-gray-200 bg-white">
        <button
          v-for="f in filters"
          :key="f.value"
          @click="activeFilter = f.value; fetchData()"
          :class="activeFilter === f.value
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-50'"
          class="px-4 py-2 text-sm font-medium transition-colors"
        >
          {{ f.label }} ({{ f.value === 'all' ? totalAll : f.value === 'draft' ? totalDraft : totalPublished }})
        </button>
      </div>

      <!-- Search -->
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="search"
          @input="debouncedFetch"
          placeholder="Cari judul atau konten..."
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <!-- Sort -->
      <select
        v-model="sort"
        @change="fetchData"
        class="h-[38px] px-3 py-2 border border-gray-200 rounded-md text-sm bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8 cursor-pointer"
        :style="selectStyle"
      >
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-24 bg-gray-100 rounded-xl animate-pulse"/>
    </div>

    <!-- Empty -->
    <div v-else-if="activities.length === 0" class="text-center py-16 text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <p class="text-sm">Belum ada kegiatan</p>
    </div>

    <!-- Activity Cards -->
    <div v-else class="space-y-3">
      <div
        v-for="activity in activities"
        :key="activity.id"
        @click="goToEditor(activity.id)"
        class="group relative flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
      >
        <!-- Thumbnail -->
        <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          <img
            v-if="activity.image"
            :src="activity.image"
            :alt="activity.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-800 truncate">{{ activity.title || 'Tanpa Judul' }}</h3>
          <div class="flex items-center gap-2 mt-1">
            <span
              :class="activity.status === 'published' ? 'text-green-600' : 'text-yellow-600'"
              class="text-xs font-medium"
            >
              {{ activity.status === 'published' ? 'Published' : 'Draft' }}
            </span>
            <span class="text-gray-300 text-xs">•</span>
            <span class="text-xs text-gray-400">
              {{ activity.status === 'published' ? 'Dipublikasikan' : 'Diperbarui' }}
              {{ formatDate(activity.status === 'published' ? activity.createdAt : activity.updatedAt) }}
            </span>
          </div>
        </div>

        <!-- Action Buttons (muncul saat hover) -->
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

          <!-- Publish (kalau draft) atau Retract (kalau published) -->
          <div class="relative tooltip-wrapper">
            <button
              @click.stop="activity.status === 'draft' ? publishActivity(activity) : retractActivity(activity)"
              :class="activity.status === 'draft' ? 'text-blue-600 hover:bg-blue-50' : 'text-yellow-600 hover:bg-yellow-50'"
              class="p-2 rounded-lg transition-colors"
            >
              <!-- Icon publish (draft) -->
              <svg v-if="activity.status === 'draft'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              <!-- Icon retract (published) -->
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
              </svg>
            </button>
            <div class="tooltip-text absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap pointer-events-none z-10">
              {{ activity.status === 'draft' ? 'Publish' : 'Tarik ke Draft' }}
            </div>
          </div>

          <!-- Preview -->
          <div class="relative tooltip-wrapper">
            <button
              @click.stop="previewActivity(activity)"
              class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
            <div class="tooltip-text absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap pointer-events-none z-10">
              Preview
            </div>
          </div>

          <!-- Hapus -->
          <div class="relative tooltip-wrapper">
            <button
              @click.stop="deleteActivity(activity)"
              class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
            <div class="tooltip-text absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap pointer-events-none z-10">
              Hapus
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-6">
      <span class="text-sm text-gray-500">
        Menampilkan {{ start }}–{{ end }} dari {{ totalEntries }} kegiatan
      </span>
      <div class="flex gap-1">
        <button
          @click="page--; fetchData()"
          :disabled="page <= 1"
          class="px-3 py-1.5 text-sm border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          Prev
        </button>
        <button
          @click="page++; fetchData()"
          :disabled="page >= totalPages"
          class="px-3 py-1.5 text-sm border border-gray-200 rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import { GET_ACTIVITIES, DELETE_ACTIVITY, POST_ACTIVITY, PUBLISH_ACTIVITY, GET_ACTIVITY_COUNTS, PUT_ACTIVITY } from '@/store/activity.module';


const store = useStore();
const router = useRouter();

const isLoading = ref(true);
const search = ref('');
const activeFilter = ref('all');
const sort = ref('newest');
const page = ref(1);
const limit = ref(10);

const filters = computed(() => [
  { label: 'Semua', value: 'all', count: totalAll.value },
  { label: 'Draft', value: 'draft', count: totalDraft.value },
  { label: 'Published', value: 'published', count: totalPublished.value },
]);

const activitiesData = computed(() => store.getters.activities);
const activities = computed(() => activitiesData.value?.data || []);
const totalEntries = computed(() => activitiesData.value?.pagination?.totalEntries || 0);
const totalPages = computed(() => activitiesData.value?.pagination?.totalPages || 0);
const start = computed(() => activitiesData.value?.pagination?.start || 0);
const end = computed(() => activitiesData.value?.pagination?.end || 0);


const totalDraft = ref(0);
const totalPublished = ref(0);
const totalAll = ref(0);

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
  backgroundSize: '16px',
}

const retractActivity = async (activity: any) => {
  const result = await Swal.fire({
    title: 'Tarik ke draft?',
    text: 'Kegiatan tidak akan terlihat publik.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d97706',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, tarik ke draft',
    cancelButtonText: 'Batal'
  });
  if (result.isConfirmed) {
    await store.dispatch(PUT_ACTIVITY, { id: activity.id, data: { status: 'draft' } });
    await fetchData();
  }
};

const fetchCounts = async () => {
  const counts = await store.dispatch(GET_ACTIVITY_COUNTS);
  totalDraft.value = counts.draft;
  totalPublished.value = counts.published;
  totalAll.value = counts.total;
};

const fetchData = async () => {
  isLoading.value = true;
  await Promise.all([
    store.dispatch(GET_ACTIVITIES, {
      search: search.value,
      page: page.value,
      limit: limit.value,
      status: activeFilter.value === 'all' ? undefined : activeFilter.value,
      sort: sort.value,
    }),
    fetchCounts()
  ]);
  isLoading.value = false;
};

const getSortOrder = () => {
  switch (sort.value) {
    case 'oldest': return [['createdAt', 'ASC']];
    case 'az': return [['title', 'ASC']];
    case 'za': return [['title', 'DESC']];
    default: return [['createdAt', 'DESC']];
  }
};

// Debounce search
let searchTimer: any = null;
const debouncedFetch = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    page.value = 1;
    fetchData();
  }, 400);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

const createNew = () => {
  router.push({ name: 'KegiatanEditor', params: { id: 'new' } });
};

const goToEditor = (id: number) => {
  router.push({ name: 'KegiatanEditor', params: { id } });
};

const previewActivity = (activity: any) => {
  const route = router.resolve({ name: 'KegiatanPreview', params: { id: activity.id } });
  window.open(route.href, '_blank');
};

const publishActivity = async (activity: any) => {
  const result = await Swal.fire({
    title: 'Publish kegiatan ini?',
    text: 'Kegiatan akan dipublikasikan dan dapat dilihat publik.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, publish!',
    cancelButtonText: 'Batal'
  });
  if (result.isConfirmed) {
    await store.dispatch(PUBLISH_ACTIVITY, activity.id);
    await fetchData();
    Swal.fire({ title: 'Published!', icon: 'success', confirmButtonColor: '#2563eb' });
  }
};

const deleteActivity = async (activity: any) => {
  const result = await Swal.fire({
    title: 'Hapus kegiatan ini?',
    text: 'Data yang dihapus tidak dapat dikembalikan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  });
  if (result.isConfirmed) {
    await store.dispatch(DELETE_ACTIVITY, { id: activity.id });
    await fetchData();
  }
};

onMounted(fetchData);
</script>