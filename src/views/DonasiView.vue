<template>
  <div>
    <ModalForm
      v-if="isOpened"
      :id="currentId"
      :title="`${currentId ? 'Edit' : 'Tambah'} ${title}`"
      :data="dataUpdate"
      @close="handleModalClose"
    />

    <div
      v-if="isImageModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60"
      @click="closeImageModal"
    >
      <img :src="selectedImage" alt="Bukti Bayar" class="max-w-full max-h-full rounded-md shadow-lg" />
    </div>

    <div class="mt-8 space-y-5">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">{{ title }}</h2>
          <p class="mt-0.5 text-sm text-gray-500">Donasi manual & online (Midtrans) tercatat dalam satu daftar.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-500"
            @click="openAddModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
            </svg>
            Tambah Donasi
          </button>
          <a
            :href="excelUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white transition-colors bg-emerald-600 rounded-md hover:bg-emerald-500"
          >
            Excel
            <IcLink class="w-4 h-4" />
          </a>
        </div>
      </div>

      <div class="p-3 bg-white border border-gray-200 rounded-md">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label class="block mb-1 text-xs text-gray-500">Per halaman</label>
            <select
              v-model="limit"
              @change="getData"
              class="block w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-xs text-gray-500">Metode</label>
            <select
              v-model="paymentMethod"
              @change="getData"
              class="block w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Semua</option>
              <option value="manual">Manual</option>
              <option value="midtrans">Midtrans</option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-xs text-gray-500">Status</label>
            <select
              v-model="paymentStatus"
              @change="getData"
              class="block w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Semua</option>
              <option value="pending">Pending</option>
              <option value="settlement">Settlement</option>
              <option value="expired">Expired</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-xs text-gray-500">Jenis Donasi</label>
            <select
              v-model="donationType"
              @change="getData"
              class="block w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Semua</option>
              <option value="iuran_sukarela">Iuran Sukarela</option>
              <option value="kontribusi_anggota">Kontribusi Anggota</option>
              <option value="kontribusi_donatur">Kontribusi Donatur</option>
              <option value="pembelian_merchandise">Pembelian Merchandise</option>
              <option value="kontribusi_sukarela">Kontribusi Sukarela</option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-xs text-gray-500">Cari Nama</label>
            <input
              v-model="search"
              @input="getData"
              placeholder="Ketik nama..."
              class="block w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div class="overflow-hidden bg-white border border-gray-200 rounded-md">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">No</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Tanggal</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Donatur</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Jenis</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Fakultas</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Kode</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-right text-gray-500 uppercase">Nominal</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Metode</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Bukti</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-if="isLoading">
                <td colspan="10" class="px-4 py-6 text-sm text-center text-gray-500">Memuat data...</td>
              </tr>
              <tr v-else-if="computedData.length === 0">
                <td colspan="10" class="px-4 py-10 text-sm text-center text-gray-500">Belum ada donasi.</td>
              </tr>
              <tr
                v-else
                v-for="(u, index) in computedData"
                :key="u.id"
                class="transition-colors hover:bg-gray-50"
              >
                <td class="px-4 py-3 text-gray-500 align-middle">{{ startNumber + index }}</td>
                <td class="px-4 py-3 text-gray-700 align-middle whitespace-nowrap">{{ formatDate(u.date || u.createdAt) }}</td>
                <td class="px-4 py-3 align-middle">
                  <p class="font-medium text-gray-900 whitespace-nowrap">{{ u.name || '-' }}</p>
                  <p v-if="u.email" class="text-xs text-gray-500 whitespace-nowrap">{{ u.email }}</p>
                  <p v-if="u.noWhatsapp" class="text-xs text-gray-500 whitespace-nowrap">{{ u.noWhatsapp }}</p>
                </td>
                <td class="px-4 py-3 text-gray-700 align-middle">{{ formatDonationType(u.donationType) }}</td>
                <td class="px-4 py-3 text-gray-700 align-middle whitespace-nowrap">{{ u.faculty?.name || '-' }}</td>
                <td class="px-4 py-3 font-mono text-xs text-gray-600 align-middle">{{ u.kodeUnik || u.faculty?.kodeUnik || '-' }}</td>
                <td class="px-4 py-3 font-medium text-right text-gray-900 align-middle whitespace-nowrap">{{ formatNominal(u.grossAmount || u.amount) }}</td>
                <td class="px-4 py-3 align-middle">
                  <span :class="methodBadgeClass(u.paymentMethod)" class="inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize">
                    {{ u.paymentMethod === 'midtrans' ? 'Midtrans' : 'Manual' }}
                  </span>
                </td>
                <td class="px-4 py-3 align-middle">
                  <span :class="statusBadgeClass(u.paymentStatus)" class="inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize">
                    {{ u.paymentStatus || 'pending' }}
                  </span>
                </td>
                <td class="px-4 py-3 align-middle">
                  <button
                    v-if="u.proof"
                    class="text-sm font-medium text-indigo-600 hover:underline"
                    @click="openImageModal(u.proof)"
                  >Lihat</button>
                  <span v-else class="text-gray-400">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col items-center justify-between gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50 sm:flex-row">
          <span class="text-xs text-gray-500">
            Menampilkan {{ pagination?.start || 0 }}–{{ pagination?.end || 0 }} dari {{ pagination?.totalEntries || 0 }} entri
          </span>
          <div class="inline-flex">
            <button
              class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="page <= 1"
              @click="() => { page = (pagination?.currentPage || 1) - 1; getData(); }"
            >Sebelumnya</button>
            <button
              class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border-t border-b border-r border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="page >= (pagination?.totalPages || 1)"
              @click="() => { page = (pagination?.currentPage || 1) + 1; getData(); }"
            >Berikutnya</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { GET_DONASI } from '@/store/donasi.module';
import ModalForm from '@/components/modal/FormDonation.vue';
import IcLink from '@/assets/svg/ic-link.vue';
import { useStore } from 'vuex';
import { formatDate } from '@/utils';

const excelUrl =
  'https://docs.google.com/spreadsheets/d/13w3FcIz4jjIBcf7DvG_83FmU8NBss_MkGt4lM7U6x6k/edit?usp=sharing';

const store = useStore();

const isLoading = ref(true);
const page = ref(1);
const limit = ref(10);
const search = ref('');
const paymentMethod = ref('');
const paymentStatus = ref('');
const donationType = ref('');
const isImageModalOpen = ref(false);
const selectedImage = ref('');
const title = ref('Donasi');

const isOpened = ref(false);
const currentId = ref<string | undefined>(undefined);
const dataUpdate = ref<Record<string, any>>({});

const openAddModal = () => {
  currentId.value = undefined;
  dataUpdate.value = {};
  isOpened.value = true;
};

const handleModalClose = async () => {
  isOpened.value = false;
  currentId.value = undefined;
  dataUpdate.value = {};
  await getData();
};

const computedData = computed(() => {
  const donasi = store.getters.donasi;
  return donasi?.data || [];
});

const pagination = computed(() => {
  const donasi = store.getters.donasi;
  return donasi?.pagination || {};
});

const startNumber = computed(() => pagination.value?.start || 1);

const formatDonationType = (t?: string) => {
  if (!t) return '-';
  return t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatNominal = (amount?: number | string | null) => {
  if (amount == null || amount === '') return '-';
  const n = Number(amount);
  if (Number.isNaN(n)) return String(amount);
  return `Rp ${n.toLocaleString('id-ID')}`;
};

const methodBadgeClass = (method?: string) =>
  method === 'midtrans' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700';

const statusBadgeClass = (status?: string) => {
  switch (status) {
    case 'settlement':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'expired':
      return 'bg-gray-200 text-gray-700';
    case 'failed':
      return 'bg-red-100 text-red-700';
    case 'refunded':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getData = async () => {
  isLoading.value = true;
  try {
    await store.dispatch(GET_DONASI, {
      data: {
        search: search.value,
        limit: limit.value,
        page: page.value,
        paymentMethod: paymentMethod.value || undefined,
        paymentStatus: paymentStatus.value || undefined,
        donationType: donationType.value || undefined,
      },
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(getData);

const openImageModal = (imageUrl: string) => {
  selectedImage.value = imageUrl;
  isImageModalOpen.value = true;
};
const closeImageModal = () => {
  isImageModalOpen.value = false;
};
</script>
