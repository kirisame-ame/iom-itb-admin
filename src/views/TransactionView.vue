<template>
  <div class="min-h-screen">
    <Breadcrumb breadcrumb="transaksi-merchandise" />

    <div
      v-if="isImageModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60"
      @click="closeImageModal"
    >
      <img :src="selectedImage" alt="Bukti Bayar" class="max-w-full max-h-full rounded-md shadow-lg" />
    </div>

    <div class="mt-8 space-y-5">
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-6 text-white shadow-sm">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100">
              Merchandise IOM ITB
            </p>
            <h1 class="text-3xl font-bold tracking-tight md:text-4xl">Transaksi Merchandise</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
              Kelola pembayaran, bukti transfer, dan status pengiriman pesanan merchandise.
            </p>
          </div>
          <div class="rounded-2xl bg-white/10 px-4 py-3 text-sm text-blue-50">
            <p class="text-xs uppercase tracking-wider text-blue-100">Status pesanan</p>
            <p class="mt-1 font-semibold">Ubah dari dropdown, lalu klik Simpan.</p>
          </div>
        </div>
      </section>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label class="block mb-1 text-xs text-slate-500">Per halaman</label>
            <select
              v-model="limit"
              @change="refreshFromFirstPage"
              class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-xs text-slate-500">Metode Bayar</label>
            <select
              v-model="paymentMethod"
              @change="refreshFromFirstPage"
              class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Semua</option>
              <option value="manual">Manual</option>
              <option value="midtrans">Midtrans</option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-xs text-slate-500">Status Bayar</label>
            <select
              v-model="paymentStatus"
              @change="refreshFromFirstPage"
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
            <label class="block mb-1 text-xs text-slate-500">Status Pesanan</label>
            <select
              v-model="orderStatus"
              @change="refreshFromFirstPage"
              class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Semua</option>
              <option v-for="status in orderStatusOptions" :key="status" :value="status">
                {{ formatStatus(status) }}
              </option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-xs text-slate-500">Cari</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-2.5">
                <svg viewBox="0 0 24 24" class="w-4 h-4 text-slate-400 fill-current">
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
                </svg>
              </span>
              <input
                v-model="search"
                @input="onSearchInput"
                placeholder="Kode, nama, email..."
                class="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-blue-900">
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">No</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Pesanan</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Pembeli</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Alamat</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-right text-blue-100 uppercase">Total</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Pembayaran</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Status Pesanan</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Tanggal</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Bukti</th>
                <th class="px-4 py-3.5 text-xs font-semibold tracking-wider text-right text-blue-100 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-100">
              <tr v-if="isLoading">
                <td v-for="c in 10" :key="c" class="px-4 py-4">
                  <div class="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100"></div>
                </td>
              </tr>
              <tr v-else-if="computedData.length === 0">
                <td colspan="10" class="px-4 py-12 text-sm text-center text-slate-400 italic">Belum ada transaksi merchandise.</td>
              </tr>
              <tr
                v-else
                v-for="(u, index) in computedData"
                :key="u.id"
                class="transition-colors hover:bg-blue-50/40"
              >
                <td class="px-4 py-4 text-slate-500 align-middle">{{ startNumber + index }}</td>
                <td class="px-4 py-4 align-middle">
                  <p class="font-semibold text-slate-900 whitespace-nowrap">{{ u.code || '-' }}</p>
                  <p class="mt-0.5 text-xs text-slate-500 whitespace-nowrap">
                    {{ merchandiseName(u) }} x {{ u.qty || 0 }}
                  </p>
                </td>
                <td class="px-4 py-4 align-middle">
                  <p class="font-medium text-slate-900 whitespace-nowrap">{{ u.username || '-' }}</p>
                  <p class="text-xs text-slate-500 whitespace-nowrap">{{ u.email || '-' }}</p>
                  <p class="text-xs text-slate-500 whitespace-nowrap">{{ u.noTelp || '-' }}</p>
                </td>
                <td class="px-4 py-4 align-middle">
                  <p class="max-w-[240px] text-slate-600 line-clamp-2" :title="u.address || '-'">
                    {{ u.address || '-' }}
                  </p>
                </td>
                <td class="px-4 py-4 text-right align-middle whitespace-nowrap">
                  <p class="font-semibold text-slate-900">{{ formatNominal(u.grossAmount) }}</p>
                  <p class="text-xs text-slate-500">{{ u.qty || 0 }} item</p>
                </td>
                <td class="px-4 py-4 align-middle">
                  <div class="space-y-1">
                    <span :class="methodBadgeClass(u.paymentMethod)" class="inline-block px-2 py-0.5 text-xs font-medium rounded-full">
                      {{ paymentMethodLabel(u.paymentMethod) }}
                    </span>
                    <br />
                    <span :class="paymentStatusBadgeClass(u.paymentStatus)" class="inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize">
                      {{ paymentStatusLabel(u.paymentStatus) }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-4 align-middle">
                  <div class="min-w-[170px] space-y-2">
                    <select
                      v-model="statusDraft[u.id]"
                      :disabled="savingStatus[u.id]"
                      class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option v-for="status in orderStatusOptions" :key="status" :value="status">
                        {{ formatStatus(status) }}
                      </option>
                    </select>
                    <span
                      class="inline-block px-2 py-0.5 text-xs font-medium rounded-full"
                      :class="orderStatusBadgeClass(statusDraft[u.id] || u.status)"
                    >
                      {{ formatStatus(statusDraft[u.id] || u.status) }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-4 text-slate-600 align-middle whitespace-nowrap">
                  <p>{{ formatDate(u.createdAt) }}</p>
                  <p class="text-xs text-slate-400">Update: {{ formatDate(u.updatedAt) }}</p>
                </td>
                <td class="px-4 py-4 align-middle">
                  <button
                    v-if="isManualProof(u.payment)"
                    class="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    @click="openImageModal(u.payment || '')"
                  >
                    Lihat
                  </button>
                  <span
                    v-else
                    class="inline-flex h-8 min-w-[54px] items-center justify-center rounded-full bg-slate-100 px-3 text-xs font-semibold text-slate-500"
                  >
                    {{ u.paymentMethod === 'midtrans' ? 'MID' : '-' }}
                  </span>
                </td>
                <td class="px-4 py-4 text-right align-middle whitespace-nowrap">
                  <button
                    type="button"
                    :disabled="savingStatus[u.id] || !hasStatusChanged(u)"
                    class="mr-2 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                    @click.prevent="saveStatus(u)"
                  >
                    {{ savingStatus[u.id] ? 'Saving...' : 'Simpan' }}
                  </button>
                  <button
                    type="button"
                    class="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                    @click.prevent="deleteItem(u.id)"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col items-center justify-between gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row">
          <span class="text-xs text-slate-500">
            Menampilkan {{ pagination?.start || 0 }}-{{ pagination?.end || 0 }} dari {{ pagination?.totalEntries || 0 }} entri
          </span>
          <div class="inline-flex">
            <button
              class="rounded-l-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="page <= 1"
              @click="() => { page = (pagination?.currentPage || 1) - 1; getData(); }"
            >
              Sebelumnya
            </button>
            <button
              class="rounded-r-lg border-y border-r border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="page >= (pagination?.totalPages || 1)"
              @click="() => { page = (pagination?.currentPage || 1) + 1; getData(); }"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { GET_TRANSACTIONS, DELETE_TRANSACTION, PUT_TRANSACTION } from '@/store/transaction.module';
import Breadcrumb from '@/components/AppBreadcrumb.vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';

type Merchandise = {
  id?: number;
  name?: string;
  price?: number | string | null;
};

type Transaction = {
  id: number;
  code?: string;
  username?: string;
  email?: string;
  noTelp?: string;
  address?: string;
  merchandiseId?: number;
  merchandises?: Merchandise;
  qty?: number;
  payment?: string | null;
  paymentMethod?: string;
  paymentStatus?: string;
  grossAmount?: number | string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

const store = useStore();

const isLoading = ref(true);
const page = ref(1);
const limit = ref(10);
const search = ref('');
const paymentMethod = ref('');
const paymentStatus = ref('');
const orderStatus = ref('');
const isImageModalOpen = ref(false);
const selectedImage = ref('');
const statusDraft = ref<Record<number, string>>({});
const savingStatus = ref<Record<number, boolean>>({});
const orderStatusOptions = ['waiting', 'on process', 'on delivery', 'arrived', 'done', 'canceled', 'denied'];
const notifyStatuses = new Set(['on process', 'on delivery', 'arrived', 'done', 'canceled', 'denied']);
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const computedData = computed<Transaction[]>(() => {
  const transactions = store.getters.transactions;
  return Array.isArray(transactions) ? transactions : [];
});

const pagination = computed(() => store.getters.transactionPagination || {});
const startNumber = computed(() => pagination.value?.start || 1);

const getData = async () => {
  isLoading.value = true;

  try {
    const data = await store.dispatch(GET_TRANSACTIONS, {
      data: {
        page: page.value,
        limit: limit.value,
        search: search.value || undefined,
        paymentMethod: paymentMethod.value || undefined,
        paymentStatus: paymentStatus.value || undefined,
        status: orderStatus.value || undefined,
      },
    });

    (data || []).forEach((transaction: Transaction) => {
      statusDraft.value[transaction.id] = transaction.status;
    });

    return data;
  } finally {
    isLoading.value = false;
  }
};

const refreshFromFirstPage = () => {
  page.value = 1;
  getData();
};

const onSearchInput = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(refreshFromFirstPage, 350);
};

onMounted(getData);

const openImageModal = (imageUrl: string) => {
  selectedImage.value = imageUrl;
  isImageModalOpen.value = true;
};

const closeImageModal = () => {
  isImageModalOpen.value = false;
};

const isManualProof = (payment?: string | null) => Boolean(payment) && !String(payment).startsWith('midtrans:');

const merchandiseName = (transaction: Transaction) => {
  return transaction.merchandises?.name || `Merchandise #${transaction.merchandiseId || '-'}`;
};

const formatStatus = (status?: string) => {
  if (!status) return '-';
  return status.replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatNominal = (amount?: number | string | null) => {
  if (amount == null || amount === '') return '-';
  const value = Number(amount);
  if (Number.isNaN(value)) return String(amount);
  return `Rp ${value.toLocaleString('id-ID')}`;
};

const paymentMethodLabel = (method?: string) => {
  if (method === 'midtrans') return 'Midtrans';
  if (method === 'manual') return 'Manual';
  return '-';
};

const paymentStatusLabel = (status?: string) => status || 'pending';

const methodBadgeClass = (method?: string) =>
  method === 'midtrans' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700';

const paymentStatusBadgeClass = (status?: string) => {
  switch (status) {
    case 'settlement':
      return 'bg-green-100 text-green-700';
    case 'expired':
      return 'bg-gray-200 text-gray-700';
    case 'failed':
      return 'bg-red-100 text-red-700';
    case 'refunded':
      return 'bg-purple-100 text-purple-700';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-700';
  }
};

const orderStatusBadgeClass = (status?: string) => {
  switch (status) {
    case 'done':
    case 'arrived':
      return 'bg-green-100 text-green-700';
    case 'on process':
    case 'on delivery':
      return 'bg-blue-100 text-blue-700';
    case 'canceled':
    case 'denied':
      return 'bg-red-100 text-red-700';
    case 'waiting':
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year}, ${hour}:${minute}`;
};

const hasStatusChanged = (item: Transaction) => {
  return Boolean(item?.id) && Boolean(statusDraft.value[item.id]) && statusDraft.value[item.id] !== item.status;
};

const getErrorMessage = (error: unknown) => {
  const apiError = error as { response?: { data?: { message?: string } }; message?: string };
  return apiError?.response?.data?.message || apiError?.message || 'Terjadi kesalahan.';
};

const saveStatus = async (item: Transaction) => {
  const nextStatus = statusDraft.value[item.id];

  if (!nextStatus || nextStatus === item.status) return;

  const confirmation = await Swal.fire({
    title: 'Update status pesanan?',
    text: notifyStatuses.has(nextStatus)
      ? 'Pembeli akan menerima notifikasi Email dan WhatsApp jika kontak tersedia.'
      : 'Status pesanan akan diperbarui.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, update',
    cancelButtonText: 'Batal',
  });

  if (!confirmation.isConfirmed) {
    statusDraft.value[item.id] = item.status;
    return;
  }

  savingStatus.value[item.id] = true;

  try {
    await store.dispatch(PUT_TRANSACTION, {
      id: item.id,
      data: {
        status: nextStatus,
      },
    });
    await getData();
    await Swal.fire({
      title: 'Berhasil',
      text: 'Status pesanan berhasil diperbarui.',
      icon: 'success',
      confirmButtonColor: '#4f46e5',
    });
  } catch (error) {
    statusDraft.value[item.id] = item.status;
    await Swal.fire({
      title: 'Gagal update status',
      text: getErrorMessage(error),
      icon: 'error',
      confirmButtonColor: '#4f46e5',
    });
  } finally {
    savingStatus.value[item.id] = false;
  }
};

const deleteItem = async (id: number) => {
  const confirmation = await Swal.fire({
    title: 'Hapus transaksi?',
    text: 'Data transaksi yang dihapus tidak bisa dikembalikan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  });

  if (!confirmation.isConfirmed) return;

  try {
    await store.dispatch(DELETE_TRANSACTION, { id });
    await getData();
    await Swal.fire({
      title: 'Terhapus',
      text: 'Transaksi berhasil dihapus.',
      icon: 'success',
      confirmButtonColor: '#4CAF50',
      confirmButtonText: 'OK',
    });
  } catch (error) {
    await Swal.fire({
      title: 'Gagal hapus transaksi',
      text: getErrorMessage(error),
      icon: 'error',
      confirmButtonColor: '#4f46e5',
    });
  }
};
</script>
