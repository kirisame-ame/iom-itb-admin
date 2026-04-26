<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">

    <!-- Top Bar -->
    <div class="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
      <!-- Kiri: back + judul halaman -->
      <div class="flex items-center gap-3 min-w-0">
        <button
          @click="$router.push('/kegiatan')"
          class="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </button>
        <span class="text-sm text-gray-500 truncate">Kegiatan</span>
        <span class="text-gray-300">/</span>
        <span class="text-sm text-gray-700 font-medium truncate">{{ form.title || 'Untitled' }}</span>
        <!-- Status badge -->
        <span
          :class="form.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
          class="px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0"
        >
          {{ form.status === 'published' ? 'Published' : 'Draft' }}
        </span>
      </div>

      <!-- Kanan: last updated + actions -->
      <div class="flex items-center gap-3 flex-shrink-0">
        <span v-if="lastUpdated" class="text-xs text-gray-400 hidden sm:block">
          Diperbarui: {{ lastUpdated }}
        </span>
        <span v-if="saveStatus" class="text-xs text-gray-400">{{ saveStatus }}</span>

        <!-- Tombol berdasarkan status -->
        <template v-if="form.status === 'draft'">
          <button
            @click="saveAsDraft"
            :disabled="isSaving || !activityId"
            class="px-4 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            Simpan Draft
          </button>
        </template>
        <template v-else>
          <button
            @click="pullToDraft"
            :disabled="isSaving"
            class="px-4 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            Tarik ke Draft
          </button>
        </template>

        <button
          @click="previewActivity"
          :disabled="!activityId"
          class="px-4 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
        >
          Preview
        </button>

        <button
          @click="publish"
          :disabled="isSaving || form.status === 'published'"
          class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-40 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          Publish
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">

      <!-- Editor Area -->
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-3xl mx-auto px-8 py-10">

          <!-- Judul -->
          <input
            v-model="form.title"
            @input="handleTitleInput"
            placeholder="Judul kegiatan..."
            class="w-full text-4xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-200 mb-6 leading-tight"
          />

          <!-- Quill Toolbar + Editor -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <QuillEditor
              v-model:content="form.description"
              content-type="html"
              @update:content="autoSave"
              :options="quillOptions"
              class="min-h-[600px]"
              ref="quillRef"
            />
          </div>

        </div>
      </div>

      <!-- Sidebar Kanan -->
      <div class="w-80 flex-shrink-0 border-l border-gray-200 bg-white overflow-y-auto flex flex-col">

        <!-- Media Preview Section -->
        <div class="p-5 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-700 mb-4">Media</h3>

          <!-- Kalau ada media -->
          <div v-if="form.media.length > 0">
            <!-- Preview utama -->
            <div class="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden mb-3">
              <img
                v-if="form.media[currentMediaIndex]?.type === 'image'"
                :src="form.media[currentMediaIndex]?.value"
                class="w-full h-full object-cover"
              />
              <div
                v-else-if="form.media[currentMediaIndex]?.type === 'youtube'"
                class="w-full h-full flex items-center justify-center bg-gray-900"
              >
                <svg class="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z"/>
                </svg>
              </div>

              <!-- Counter -->
              <div class="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                {{ currentMediaIndex + 1 }} / {{ form.media.length }}
              </div>
            </div>

            <!-- Thumbnail previews + nav -->
            <div class="flex items-center gap-2 mb-3">
              <!-- Prev -->
              <button
                @click="prevMedia"
                :disabled="currentMediaIndex === 0"
                class="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors flex-shrink-0"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>

              <!-- Thumbnail strip -->
              <div class="flex gap-1.5 flex-1 overflow-x-auto scrollbar-hide">
                <button
                  v-for="(item, i) in form.media"
                  :key="i"
                  @click="currentMediaIndex = i"
                  :class="currentMediaIndex === i ? 'ring-2 ring-blue-500' : 'opacity-60 hover:opacity-100'"
                  class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 transition-all"
                >
                  <img v-if="item.type === 'image'" :src="item.value" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full bg-gray-800 flex items-center justify-center">
                    <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </button>
              </div>

              <!-- Next -->
              <button
                @click="nextMedia"
                :disabled="currentMediaIndex === form.media.length - 1"
                class="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors flex-shrink-0"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <!-- Set as thumbnail -->
            <button
              v-if="form.media[currentMediaIndex]?.type === 'image'"
              @click="setAsThumbnail(currentMediaIndex)"
              :class="form.image === form.media[currentMediaIndex]?.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'"
              class="w-full px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors flex items-center justify-center gap-1.5 mb-3"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ form.image === form.media[currentMediaIndex]?.value ? 'Thumbnail aktif' : 'Set as thumbnail' }}
            </button>

            <!-- Caption -->
            <div class="mb-3">
              <label class="block text-xs text-gray-500 mb-1">Caption</label>
              <input
                v-model="form.media[currentMediaIndex].caption"
                @input="autoSave"
                placeholder="Tambahkan caption..."
                class="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Move urutan + Hapus -->
            <div class="flex gap-2">
              <button
                @click="moveMedia('left')"
                :disabled="currentMediaIndex === 0"
                class="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors flex items-center justify-center gap-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Maju
              </button>
              <button
                @click="moveMedia('right')"
                :disabled="currentMediaIndex === form.media.length - 1"
                class="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors flex items-center justify-center gap-1"
              >
                Mundur
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              <button
                @click="removeMedia(currentMediaIndex)"
                class="px-2 py-1.5 text-xs border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Kalau belum ada media -->
          <div v-else class="w-full aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 mb-3">
            <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p class="text-xs">Belum ada media</p>
          </div>
        </div>

        <!-- Add New Media Section -->
        <div class="p-5 flex-1">
          <h3 class="text-sm font-semibold text-gray-700 mb-4">Tambah Media</h3>

          <!-- Tipe media dropdown -->
          <div class="mb-3">
            <label class="block text-xs text-gray-500 mb-1">Tipe Media</label>
            <select
              v-model="newMediaType"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="upload">Upload Gambar</option>
              <option value="url">URL Gambar</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          <!-- Field sesuai tipe -->
          <div class="mb-3">
            <!-- Upload -->
            <div v-if="newMediaType === 'upload'">
              <label class="block w-full px-3 py-2.5 text-xs text-center border border-dashed border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                Pilih file gambar...
                <input type="file" accept="image/*" multiple class="hidden" @change="uploadMedia" />
              </label>
            </div>

            <!-- URL Gambar -->
            <div v-else-if="newMediaType === 'url'">
              <label class="block text-xs text-gray-500 mb-1">URL Gambar</label>
              <input
                v-model="newMediaValue"
                placeholder="https://..."
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- YouTube -->
            <div v-else-if="newMediaType === 'youtube'">
              <label class="block text-xs text-gray-500 mb-1">URL YouTube</label>
              <input
                v-model="newMediaValue"
                placeholder="https://youtube.com/watch?v=..."
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Caption input untuk semua tipe -->
          <div class="mb-3">
            <label class="block text-xs text-gray-500 mb-1">Caption (opsional)</label>
            <input
              v-model="newMediaCaption"
              placeholder="Tambahkan caption..."
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Tombol tambah (hanya untuk url & youtube) -->
          <button
            v-if="newMediaType !== 'upload'"
            @click="addMedia"
            class="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tambah
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { GET_ACTIVITY_BY_ID, PUT_ACTIVITY, POST_ACTIVITY } from '@/store/activity.module';
import { POST_ACTIVITY_IMAGE } from '@/store/upload.module';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const store = useStore();
const quillRef = ref();

const activityId = ref<number | null>(route.params.id === 'new' ? null : Number(route.params.id));
const isSaving = ref(false);
const saveStatus = ref('');
const lastUpdated = ref('');
const currentMediaIndex = ref(0);
const newMediaType = ref<'upload' | 'url' | 'youtube'>('upload');
const newMediaValue = ref('');
const newMediaCaption = ref('');
const slugGenerated = ref(false); // flag: slug sudah pernah di-generate atau belum

const form = ref({
  title: '',
  description: '',
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

// Generate slug dari judul
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const formatUpdatedAt = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// Handle input judul — generate slug sekali saja
const handleTitleInput = () => {
  if (!slugGenerated.value && form.value.title) {
    form.value.url = generateSlug(form.value.title);
    slugGenerated.value = true;
  }
  autoSave();
};

// Auto save dengan debounce
let saveTimer: any = null;
const autoSave = () => {
  if (!form.value.title) return;
  saveStatus.value = 'Menyimpan...';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveData, 1500);
};

const saveData = async () => {
  if (isSaving.value || !form.value.title) return;
  isSaving.value = true;
  try {
    if (!activityId.value) {
      // Buat baru
      const result = await store.dispatch(POST_ACTIVITY, {
        data: { ...form.value, date: new Date().toISOString().split('T')[0], status: 'draft' }
      });
      activityId.value = result.id;
      lastUpdated.value = formatUpdatedAt(result.updatedAt);
      router.replace({ name: 'KegiatanEditor', params: { id: result.id } });
    } else {
      // Update
      const result = await store.dispatch(PUT_ACTIVITY, {
        id: activityId.value,
        data: { ...form.value }
      });
      if (result?.updatedAt) lastUpdated.value = formatUpdatedAt(result.updatedAt);
    }
    saveStatus.value = 'Tersimpan';
    setTimeout(() => { saveStatus.value = ''; }, 2000);
  } catch {
    saveStatus.value = 'Gagal menyimpan';
  } finally {
    isSaving.value = false;
  }
};

const saveAsDraft = async () => {
  if (!activityId.value) return;
  isSaving.value = true;
  try {
    const result = await store.dispatch(PUT_ACTIVITY, {
      id: activityId.value,
      data: { ...form.value, status: 'draft' }
    });
    if (result?.updatedAt) lastUpdated.value = formatUpdatedAt(result.updatedAt);
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
    Swal.fire({ title: 'Thumbnail wajib diisi sebelum publish', icon: 'warning', confirmButtonColor: '#2563eb' });
    return;
  }

  const confirm = await Swal.fire({
    title: 'Publish kegiatan ini?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, publish!',
    cancelButtonText: 'Batal'
  });

  if (!confirm.isConfirmed) return;

  isSaving.value = true;
  try {
    const result = await store.dispatch(PUT_ACTIVITY, {
      id: activityId.value,
      data: { ...form.value, status: 'published', date: new Date().toISOString().split('T')[0] }
    });
    form.value.status = 'published';
    if (result?.updatedAt) lastUpdated.value = formatUpdatedAt(result.updatedAt);
    Swal.fire({ title: 'Berhasil dipublish!', icon: 'success', confirmButtonColor: '#2563eb' });
  } catch {
    Swal.fire({ title: 'Gagal publish', icon: 'error', confirmButtonColor: '#2563eb' });
  } finally {
    isSaving.value = false;
  }
};

const pullToDraft = async () => {
  const confirm = await Swal.fire({
    title: 'Tarik kembali ke draft?',
    text: 'Kegiatan tidak akan terlihat publik.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d97706',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, tarik ke draft',
    cancelButtonText: 'Batal'
  });

  if (!confirm.isConfirmed) return;

  isSaving.value = true;
  try {
    const result = await store.dispatch(PUT_ACTIVITY, {
      id: activityId.value,
      data: { ...form.value, status: 'draft' }
    });
    form.value.status = 'draft';
    if (result?.updatedAt) lastUpdated.value = formatUpdatedAt(result.updatedAt);
  } catch {
    Swal.fire({ title: 'Gagal menarik ke draft', icon: 'error' });
  } finally {
    isSaving.value = false;
  }
};

const previewActivity = () => {
  if (!activityId.value) return;
  const resolved = router.resolve({ name: 'KegiatanPreview', params: { id: activityId.value } });
  window.open(resolved.href, '_blank');
};

// Media navigation
const prevMedia = () => {
  if (currentMediaIndex.value > 0) currentMediaIndex.value--;
};

const nextMedia = () => {
  if (currentMediaIndex.value < form.value.media.length - 1) currentMediaIndex.value++;
};

const setAsThumbnail = (index: number) => {
  const item = form.value.media[index];
  if (item.type !== 'image') return;
  if (form.value.image === item.value) {
    // Toggle off
    form.value.image = '';
  } else {
    form.value.image = item.value;
  }
  autoSave();
};

const moveMedia = (direction: 'left' | 'right') => {
  const index = currentMediaIndex.value;
  const media = form.value.media;
  if (direction === 'left' && index > 0) {
    [media[index], media[index - 1]] = [media[index - 1], media[index]];
    currentMediaIndex.value--;
  } else if (direction === 'right' && index < media.length - 1) {
    [media[index], media[index + 1]] = [media[index + 1], media[index]];
    currentMediaIndex.value++;
  }
  // Update order
  form.value.media.forEach((m, i) => { m.order = i; });
  autoSave();
};

const removeMedia = (index: number) => {
  const item = form.value.media[index];
  // Kalau yang dihapus adalah thumbnail, kosongkan thumbnail
  if (form.value.image === item.value) {
    form.value.image = '';
  }
  form.value.media.splice(index, 1);
  form.value.media.forEach((m, i) => { m.order = i; });
  if (currentMediaIndex.value >= form.value.media.length) {
    currentMediaIndex.value = Math.max(0, form.value.media.length - 1);
  }
  autoSave();
};

const uploadMedia = async (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files || []);
  for (const file of files) {
    const url = await store.dispatch(POST_ACTIVITY_IMAGE, file);
    form.value.media.push({
      type: 'image',
      value: url,
      order: form.value.media.length,
      caption: newMediaCaption.value || undefined
    });
  }
  newMediaCaption.value = '';
  currentMediaIndex.value = form.value.media.length - 1;
  autoSave();
};

const addMedia = () => {
  if (!newMediaValue.value) return;

  if (newMediaType.value === 'youtube') {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
    if (!youtubeRegex.test(newMediaValue.value)) {
      Swal.fire({ title: 'URL YouTube tidak valid', icon: 'warning', confirmButtonColor: '#2563eb' });
      return;
    }
    form.value.media.push({
      type: 'youtube',
      value: newMediaValue.value,
      order: form.value.media.length,
      caption: newMediaCaption.value || undefined
    });
  } else if (newMediaType.value === 'url') {
    try {
      const url = new URL(newMediaValue.value);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
      form.value.media.push({
        type: 'image',
        value: newMediaValue.value,
        order: form.value.media.length,
        caption: newMediaCaption.value || undefined
      });
    } catch {
      Swal.fire({ title: 'URL gambar tidak valid', icon: 'warning', confirmButtonColor: '#2563eb' });
      return;
    }
  }

  currentMediaIndex.value = form.value.media.length - 1;
  newMediaValue.value = '';
  newMediaCaption.value = '';
  autoSave();
};

onMounted(async () => {
  // Load activity kalau bukan 'new'
  if (route.params.id !== 'new') {
    const activity = await store.dispatch(GET_ACTIVITY_BY_ID, Number(route.params.id));
    form.value = {
      title: activity.title || '',
      description: activity.description || '',
      url: activity.url || '',
      image: activity.image || '',
      status: activity.status || 'draft',
      media: activity.media || [],
    };
    lastUpdated.value = formatUpdatedAt(activity.updatedAt);
    slugGenerated.value = true;
  }

  await nextTick();
  const quill = quillRef.value?.getQuill();
  if (quill) {
    quill.clipboard.addMatcher(Node.TEXT_NODE, (node: any, delta: any) => {
      const urlRegex = /https?:\/\/[^\s]+/g;
      const text = node.data;
      if (urlRegex.test(text)) {
        const ops: any[] = [];
        let lastIndex = 0;
        text.replace(urlRegex, (url: string, offset: number) => {
          if (offset > lastIndex) {
            ops.push({ insert: text.slice(lastIndex, offset) });
          }
          ops.push({ insert: url, attributes: { link: url } });
          lastIndex = offset + url.length;
        });
        if (lastIndex < text.length) {
          ops.push({ insert: text.slice(lastIndex) });
        }
        delta.ops = ops;
      }
      return delta;
    });
  }
});
</script>