<template>
  <div>
    <ModalForm
      v-if="isOpened"
      :id="currentId"
      :title="`${currentId ? 'Edit' : 'Add'} ${title}`"
      :data="dataUpdate"
      @close="handleModalClose"
    />

    <div v-if="isImageModalOpen" @click="closeImageModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <img :src="selectedImage" alt="Bukti Bayar" class="max-w-full max-h-full"/>
    </div>

    <div class="mt-8">
      <div class="mt-6">
        <div class="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 class="text-xl font-semibold leading-tight text-gray-700">{{ title }}</h2>
            <p class="text-sm text-gray-500 mt-1">Donasi manual & online (Midtrans) tergabung dalam satu pencatatan.</p>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              class="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
              @click="openAddModal"
            >
              + Add Donasi
            </button>
            <a
              class="flex items-center gap-2 px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-green-600 rounded-md hover:bg-green-500 focus:outline-none"
              :href="excelUrl"
              target="_blank"
              rel="noopener"
            >
              Excel
              <IcLink class="w-[18px]" />
            </a>
          </div>
        </div>

        <div class="flex flex-col gap-3 mt-4 sm:flex-row sm:flex-wrap sm:items-center">
          <div>
            <label class="block text-xs text-gray-500">Per halaman</label>
            <select class="mt-1 block px-3 py-2 border border-gray-400 rounded bg-white" v-model="limit" @change="getData">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>

          <div>
            <label class="block text-xs text-gray-500">Metode</label>
            <select class="mt-1 block px-3 py-2 border border-gray-400 rounded bg-white" v-model="paymentMethod" @change="getData">
              <option value="">Semua</option>
              <option value="manual">Manual</option>
              <option value="midtrans">Midtrans</option>
            </select>
          </div>

          <div>
            <label class="block text-xs text-gray-500">Status</label>
            <select class="mt-1 block px-3 py-2 border border-gray-400 rounded bg-white" v-model="paymentStatus" @change="getData">
              <option value="">Semua</option>
              <option value="pending">Pending</option>
              <option value="settlement">Settlement</option>
              <option value="expired">Expired</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label class="block text-xs text-gray-500">Jenis Donasi</label>
            <select class="mt-1 block px-3 py-2 border border-gray-400 rounded bg-white" v-model="donationType" @change="getData">
              <option value="">Semua</option>
              <option value="iuran_sukarela">Iuran Sukarela</option>
              <option value="kontribusi_anggota">Kontribusi Anggota</option>
              <option value="kontribusi_donatur">Kontribusi Donatur</option>
              <option value="pembelian_merchandise">Pembelian Merchandise</option>
              <option value="kontribusi_sukarela">Kontribusi Sukarela</option>
            </select>
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs text-gray-500">Cari Nama</label>
            <input
              placeholder="Search..."
              class="mt-1 block w-full py-2 px-3 border border-gray-400 rounded bg-white"
              v-model="search"
              @input="getData"
            />
          </div>
        </div>

        <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
          <div class="inline-block min-w-full overflow-hidden rounded-lg shadow">
            <table class="min-w-full leading-normal">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">No</th>
                  <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Tanggal</th>
                  <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Nama</th>
                  <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Email</th>
                  <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">No WA</th>
                  <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Jenis</th>
                  <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Fakultas</th>
                  <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Kode Unik</th>
                  <th class="px-4 py-3 text-xs font-semibold tracking-wider text-right text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Nominal</th>
                  <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Metode</th>
                  <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Status</th>
                  <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Bukti</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td colspan="12" class="px-5 py-5 text-sm bg-white border-b border-gray-200">Loading...</td>
                </tr>
                <tr v-else-if="computedData.length === 0">
                  <td colspan="12" class="px-5 py-5 text-sm bg-white border-b border-gray-200 text-center text-gray-500">Belum ada donasi.</td>
                </tr>
                <tr v-else v-for="(u, index) in computedData" :key="u.id">
                  <td class="px-4 py-3 text-sm bg-white border-b border-gray-200">{{ startNumber + index }}</td>
                  <td class="px-4 py-3 text-sm bg-white border-b border-gray-200">{{ formatDate(u.date || u.createdAt) }}</td>
                  <td class="px-4 py-3 text-sm bg-white border-b border-gray-200">{{ u.name }}</td>
                  <td class="px-4 py-3 text-sm bg-white border-b border-gray-200">{{ u.email }}</td>
                  <td class="px-4 py-3 text-sm bg-white border-b border-gray-200">{{ u.noWhatsapp }}</td>
                  <td class="px-4 py-3 text-sm bg-white border-b border-gray-200">{{ formatDonationType(u.donationType) }}</td>
                  <td class="px-4 py-3 text-sm bg-white border-b border-gray-200">{{ u.faculty?.name || '-' }}</td>
                  <td class="px-4 py-3 text-sm bg-white border-b border-gray-200 font-mono">{{ u.kodeUnik || u.faculty?.kodeUnik || '-' }}</td>
                  <td class="px-4 py-3 text-sm bg-white border-b border-gray-200 text-right">{{ formatNominal(u.grossAmount || u.amount) }}</td>
                  <td class="px-4 py-3 text-sm bg-white border-b border-gray-200">
                    <span :class="methodBadgeClass(u.paymentMethod)" class="px-2 py-1 rounded text-xs font-semibold">
                      {{ u.paymentMethod === 'midtrans' ? 'Midtrans' : 'Manual' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm bg-white border-b border-gray-200">
                    <span :class="statusBadgeClass(u.paymentStatus)" class="px-2 py-1 rounded text-xs font-semibold capitalize">
                      {{ u.paymentStatus || 'pending' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm bg-white border-b border-gray-200">
                    <button
                      v-if="u.proof"
                      class="text-blue-600 hover:underline"
                      @click="openImageModal(u.proof)"
                    >Lihat</button>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between">
              <span class="text-xs text-gray-900 xs:text-sm">
                Showing {{ pagination?.start || 0 }} to {{ pagination?.end || 0 }} of {{ pagination?.totalEntries || 0 }} Entries
              </span>
              <div class="inline-flex mt-2 xs:mt-0">
                <button
                  class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-l hover:bg-gray-400 disabled:opacity-50"
                  :disabled="page <= 1"
                  @click="() => { page = (pagination?.currentPage || 1) - 1; getData(); }"
                >Prev</button>
                <button
                  class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-r hover:bg-gray-400 disabled:opacity-50"
                  :disabled="page >= (pagination?.totalPages || 1)"
                  @click="() => { page = (pagination?.currentPage || 1) + 1; getData(); }"
                >Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { GET_DONASI } from "@/store/donasi.module";
import ModalForm from "@/components/modal/FormDonation.vue";
import IcLink from "@/assets/svg/ic-link.vue";
import { useStore } from 'vuex';
import { formatDate } from '@/utils';

const excelUrl = "https://docs.google.com/spreadsheets/d/13w3FcIz4jjIBcf7DvG_83FmU8NBss_MkGt4lM7U6x6k/edit?usp=sharing";

const store = useStore();

const isLoading = ref(true);
const page = ref(1);
const limit = ref(10);
const search = ref("");
const paymentMethod = ref("");
const paymentStatus = ref("");
const donationType = ref("");
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
    case 'settlement': return 'bg-green-100 text-green-700';
    case 'pending':    return 'bg-yellow-100 text-yellow-700';
    case 'expired':    return 'bg-gray-200 text-gray-700';
    case 'failed':     return 'bg-red-100 text-red-700';
    case 'refunded':   return 'bg-purple-100 text-purple-700';
    default:           return 'bg-gray-100 text-gray-600';
  }
};

const getData = async () => {
  const params = {
    data: {
      search: search.value,
      limit: limit.value,
      page: page.value,
      paymentMethod: paymentMethod.value || undefined,
      paymentStatus: paymentStatus.value || undefined,
      donationType: donationType.value || undefined,
    },
  };
  isLoading.value = true;
  await store.dispatch(GET_DONASI, params);
  isLoading.value = false;
};

onMounted(async () => {
  await getData();
});

const openImageModal = (imageUrl: string) => {
  selectedImage.value = imageUrl;
  isImageModalOpen.value = true;
};
const closeImageModal = () => {
  isImageModalOpen.value = false;
};
</script>
