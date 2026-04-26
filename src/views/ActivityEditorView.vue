<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Top Bar -->
    <div class="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="$router.push('/kegiatan')" class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </button>
        <span class="text-sm text-gray-500">Kegiatan</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-400">{{ saveStatus }}</span>
        <button
          @click="saveAsDraft"
          :disabled="isSaving"
          class="px-4 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Simpan Draft
        </button>
        <button
          @click="previewActivity"
          class="px-4 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Preview
        </button>
        <button
          @click="publish"
          :disabled="isSaving"
          class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          Publish
        </button>
      </div>
    </div>

    <div class="flex gap-6 p-6 max-w-7xl mx-auto">
      <!-- Editor Area -->
      <div class="flex-1 min-w-0">
        <!-- Title -->
        <input
          v-model="form.title"
          @input="autoSave"
          placeholder="Judul kegiatan..."
          class="w-full text-3xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-300 mb-4"
        />

        <!-- Meta fields -->
        <div class="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-200">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Tanggal</label>
            <input
              v-model="form.date"
              @change="autoSave"
              type="date"
              class="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex-1 min-w-48">
            <label class="block text-xs text-gray-500 mb-1">URL Slug</label>
            <input
              v-model="form.url"
              @input="autoSave"
              placeholder="url-kegiatan"
              class="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Quill Editor -->
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <QuillEditor
            v-model:content="form.description"
            content-type="html"
            @update:content="autoSave"
            :options="quillOptions"
            class="min-h-[500px]"
          />
        </div>
      </div>

      <!-- Sidebar Kanan -->
      <div class="w-72 flex-shrink-0 space-y-4">

        <!-- Thumbnail Card -->
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Thumbnail Utama</h3>

          <!-- Preview thumbnail -->
          <div class="w-full aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
            <img
              v-if="form.image"
              :src="form.image"
              alt="thumbnail"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>

          <!-- Pilih dari media atau upload -->
          <div v-if="form.image" class="flex gap-2">
            <button @click="form.image = ''; autoSave()" class="flex-1 px-3 py-1.5 text-xs border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors">
              Hapus
            </button>
            <button @click="selectThumbnailFromMedia" class="flex-1 px-3 py-1.5 text-xs border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 transition-colors">
              Ganti
            </button>
          </div>
          <div v-else class="space-y-2">
            <label class="block w-full px-3 py-1.5 text-xs text-center border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
              Upload Gambar
              <input type="file" accept="image/*" class="hidden" @change="uploadThumbnail" />
            </label>
            <input
              v-model="thumbnailUrlInput"
              @keyup.enter="setThumbnailFromUrl"
              placeholder="Atau paste URL gambar..."
              class="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Media Gallery Card -->
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Media Gallery</h3>

          <!-- Media list -->
          <div class="space-y-2 mb-3">
            <div
              v-for="(item, index) in form.media"
              :key="index"
              class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group"
            >
              <!-- Preview -->
              <div class="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-200">
                <img v-if="item.type === 'image'" :src="item.value" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center bg-red-100">
                  <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z"/>
                  </svg>
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-600 truncate">{{ item.type === 'youtube' ? 'YouTube' : 'Gambar' }}</p>
                <p class="text-xs text-gray-400 truncate">{{ item.value }}</p>
              </div>

              <button @click="removeMedia(index)" class="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Tambah gambar -->
          <div class="space-y-2">
            <label class="block w-full px-3 py-1.5 text-xs text-center border border-dashed border-gray-300 text-gray-500 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
              + Upload Gambar
              <input type="file" accept="image/*" multiple class="hidden" @change="uploadMedia" />
            </label>

            <!-- Input YouTube -->
            <div class="flex gap-1">
              <input
                v-model="youtubeInput"
                placeholder="URL YouTube..."
                class="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button @click="addYoutube" class="px-2 py-1.5 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors">
                +
              </button>
            </div>

            <!-- Input URL gambar eksternal -->
            <div class="flex gap-1">
              <input
                v-model="imageUrlInput"
                placeholder="URL gambar eksternal..."
                class="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button @click="addImageUrl" class="px-2 py-1.5 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors">
                +
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { GET_ACTIVITY_BY_ID, PUT_ACTIVITY } from '@/store/activity.module';
import { POST_ACTIVITY_IMAGE } from '@/store/upload.module';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const store = useStore();

const activityId = Number(route.params.id);
const isSaving = ref(false);
const saveStatus = ref('');
const youtubeInput = ref('');
const imageUrlInput = ref('');
const thumbnailUrlInput = ref('');

const form = ref({
  title: '',
  description: '',
  date: '',
  url: '',
  image: '',
  status: 'draft' as 'draft' | 'published',
  media: [] as Array<{ type: 'image' | 'youtube'; value: string; order: number; caption?: string }>
});

const quillOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['link'],
      ['clean']
    ]
  }
};

// Auto save dengan debounce
let saveTimer: any = null;
const autoSave = () => {
  saveStatus.value = 'Menyimpan...';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveAsDraft, 1500);
};

const saveAsDraft = async () => {
  if (isSaving.value) return;
  isSaving.value = true;
  try {
    await store.dispatch(PUT_ACTIVITY, {
      id: activityId,
      data: { ...form.value, status: 'draft' }
    });
    saveStatus.value = 'Tersimpan';
    setTimeout(() => { saveStatus.value = ''; }, 2000);
  } catch {
    saveStatus.value = 'Gagal menyimpan';
  } finally {
    isSaving.value = false;
  }
};

const publish = async () => {
  if (!form.value.title) {
    Swal.fire({ title: 'Judul wajib diisi', icon: 'warning', confirmButtonColor: '#2563eb' });
    return;
  }
  if (!form.value.image) {
    Swal.fire({ title: 'Thumbnail wajib diisi', icon: 'warning', confirmButtonColor: '#2563eb' });
    return;
  }
  if (!form.value.date) {
    Swal.fire({ title: 'Tanggal wajib diisi', icon: 'warning', confirmButtonColor: '#2563eb' });
    return;
  }
  isSaving.value = true;
  try {
    await store.dispatch(PUT_ACTIVITY, {
      id: activityId,
      data: { ...form.value, status: 'published' }
    });
    Swal.fire({ title: 'Berhasil dipublish!', icon: 'success', confirmButtonColor: '#2563eb' });
    router.push('/kegiatan');
  } catch {
    Swal.fire({ title: 'Gagal publish', icon: 'error', confirmButtonColor: '#2563eb' });
  } finally {
    isSaving.value = false;
  }
};

const previewActivity = () => {
  const route = router.resolve({ name: 'KegiatanPreview', params: { id: activityId } });
  window.open(route.href, '_blank');
};

const uploadThumbnail = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const url = await store.dispatch(POST_ACTIVITY_IMAGE, file);
  form.value.image = url;
  autoSave();
};

const setThumbnailFromUrl = () => {
  if (thumbnailUrlInput.value) {
    form.value.image = thumbnailUrlInput.value;
    thumbnailUrlInput.value = '';
    autoSave();
  }
};

const selectThumbnailFromMedia = () => {
  const imageMedia = form.value.media.filter(m => m.type === 'image');
  if (imageMedia.length > 0) {
    form.value.image = imageMedia[0].value;
    autoSave();
  }
};

const uploadMedia = async (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files || []);
  for (const file of files) {
    const url = await store.dispatch(POST_ACTIVITY_IMAGE, file);
    form.value.media.push({
      type: 'image',
      value: url,
      order: form.value.media.length,
    });
  }
  autoSave();
};

const addYoutube = () => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
  if (!youtubeRegex.test(youtubeInput.value)) {
    Swal.fire({ title: 'URL YouTube tidak valid', icon: 'warning', confirmButtonColor: '#2563eb' });
    return;
  }
  form.value.media.push({
    type: 'youtube',
    value: youtubeInput.value,
    order: form.value.media.length,
  });
  youtubeInput.value = '';
  autoSave();
};

const addImageUrl = () => {
  if (!imageUrlInput.value) return;
  try {
    const url = new URL(imageUrlInput.value);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    form.value.media.push({
      type: 'image',
      value: imageUrlInput.value,
      order: form.value.media.length,
    });
    imageUrlInput.value = '';
    autoSave();
  } catch {
    Swal.fire({ title: 'URL gambar tidak valid', icon: 'warning', confirmButtonColor: '#2563eb' });
  }
};

const removeMedia = (index: number) => {
  form.value.media.splice(index, 1);
  form.value.media.forEach((m, i) => { m.order = i; });
  autoSave();
};

onMounted(async () => {
  const activity = await store.dispatch(GET_ACTIVITY_BY_ID, activityId);
  form.value = {
    title: activity.title || '',
    description: activity.description || '',
    date: activity.date ? activity.date.split('T')[0] : '',
    url: activity.url || '',
    image: activity.image || '',
    status: activity.status || 'draft',
    media: activity.media || [],
  };
});
</script>