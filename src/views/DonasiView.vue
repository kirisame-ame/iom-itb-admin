<template>
  <div class="min-h-screen">
    <Breadcrumb :breadcrumb="title" />

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
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100">
              Keuangan IOM ITB
            </p>
            <h1 class="text-2xl font-bold tracking-tight md:text-4xl">{{ title }}</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">Donasi manual dan online Midtrans tercatat dalam satu daftar.</p>
          </div>
        <div class="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <button
            type="button"
            class="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#003793] shadow-lg transition-all hover:-translate-y-px hover:shadow-xl sm:w-auto"
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
            class="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-px hover:bg-emerald-400 hover:shadow-xl sm:w-auto"
          >
            Excel
            <IcLink class="w-4 h-4" />
          </a>
        </div>
      </div>
      </section>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label class="block mb-1 text-xs text-slate-500">Per halaman</label>
            <select
              v-model="limit"
              @change="() => { page = 1; getData() }"
              class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-xs text-slate-500">Metode</label>
            <select
              v-model="paymentMethod"
              @change="() => { page = 1; getData() }"
              class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Semua</option>
              <option value="manual">Manual</option>
              <option value="midtrans">Midtrans</option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-xs text-slate-500">Status</label>
            <select
              v-model="paymentStatus"
              @change="() => { page = 1; getData() }"
              class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
            <label class="block mb-1 text-xs text-slate-500">Jenis Donasi</label>
            <select
              v-model="donationType"
              @change="() => { page = 1; getData() }"
              class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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
            <label class="block mb-1 text-xs text-slate-500">Cari Nama</label>
            <input
              v-model="search"
              @input="onSearchInput"
              placeholder="Ketik nama..."
              class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-blue-900">
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">No</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Tanggal</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Donatur</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Jenis</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Fakultas</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Kode</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-right text-blue-100 uppercase">Nominal</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Metode</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Status</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Bukti</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-100">
              <tr v-if="isLoading">
                <td v-for="c in 10" :key="c" class="px-4 py-4">
                  <div class="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100"></div>
                </td>
              </tr>
              <tr v-else-if="computedData.length === 0">
                <td colspan="10" class="px-4 py-12 text-sm text-center text-slate-400 italic">Belum ada donasi.</td>
              </tr>
              <tr
                v-else
                v-for="(u, index) in computedData"
                :key="u.id"
                class="transition-colors hover:bg-blue-50/40"
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

        <div class="flex flex-col items-center justify-between gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row">
          <span class="text-xs text-slate-500">
            Menampilkan {{ pagination?.start || 0 }}–{{ pagination?.end || 0 }} dari {{ pagination?.totalEntries || 0 }} entri
          </span>
          <div class="inline-flex">
            <button
              class="rounded-l-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="page <= 1"
              @click="() => { page = (pagination?.currentPage || 1) - 1; getData(); }"
            >Sebelumnya</button>
            <button
              class="rounded-r-lg border-y border-r border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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
import Breadcrumb from '@/components/AppBreadcrumb.vue';

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
let searchTimer: ReturnType<typeof setTimeout> | null = null;

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

const onSearchInput = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    page.value = 1;
    getData();
  }, 350);
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
