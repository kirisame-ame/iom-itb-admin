<template>
  <div class="min-h-screen">
    <Breadcrumb breadcrumb="Dashboard Merchandise" />

    <div class="mt-8 space-y-5">
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative">
          <h1 class="text-2xl font-bold md:text-4xl">Dashboard Penjualan Merchandise</h1>
          <p class="mt-2 text-sm text-blue-100">
            Pantau penjualan merchandise berdasarkan kategori, jumlah terjual, dan total pendapatan.
          </p>
        </div>
      </section>

      <div v-if="isLoading" class="text-center py-20 text-slate-400">Memuat data...</div>

      <template v-else>
        <div class="flex flex-col gap-1.5 sm:max-w-xs">
          <span class="text-sm font-semibold text-slate-900">Filter Kategori</span>
          <AppSelect
            v-model="selectedKategori"
            :options="kategoriFilterOptions"
            button-class="min-w-[180px] bg-white text-slate-800"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p class="text-sm font-semibold text-slate-500">Total Produk</p>
            <p class="mt-3 text-2xl font-bold text-slate-900">{{ filteredMerchandises.length }}</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p class="text-sm font-semibold text-slate-500">Total Terjual</p>
            <p class="mt-3 text-2xl font-bold text-slate-900">{{ totalTerjual }} pcs</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p class="text-sm font-semibold text-slate-500">Total Pendapatan</p>
            <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(totalPendapatan) }}</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p class="text-sm font-semibold text-slate-500">Kategori Terlaris</p>
            <p class="mt-3 text-2xl font-bold text-slate-900">{{ kategoriTerlaris || '-' }}</p>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="mb-4 text-base font-bold text-slate-900">Pendapatan per Kategori</h2>
          <apexchart
            v-if="chartSeries[0].data.length"
            type="bar"
            height="300"
            :options="chartOptions"
            :series="chartSeries"
          />
          <p v-else class="text-sm text-slate-400">Belum ada data transaksi.</p>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100">
            <h2 class="text-base font-bold text-slate-900">Top 10 Merchandise Terlaris</h2>
          </div>
          <table class="min-w-full text-sm">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-5 py-3 text-left text-sm font-semibold text-slate-600">#</th>
                <th class="px-5 py-3 text-left text-sm font-semibold text-slate-600">Nama</th>
                <th class="px-5 py-3 text-left text-sm font-semibold text-slate-600">Kategori</th>
                <th class="px-5 py-3 text-left text-sm font-semibold text-slate-600">Harga</th>
                <th class="px-5 py-3 text-left text-sm font-semibold text-slate-600">Terjual</th>
                <th class="px-5 py-3 text-left text-sm font-semibold text-slate-600">Pendapatan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="top10.length === 0">
                <td colspan="6" class="px-5 py-8 text-center text-slate-400">Belum ada data transaksi.</td>
              </tr>
              <tr v-for="(item, idx) in top10" :key="item.id" class="hover:bg-slate-50">
                <td class="px-5 py-4 text-slate-500">{{ idx + 1 }}</td>
                <td class="px-5 py-4 font-medium text-slate-900">{{ item.name }}</td>
                <td class="px-5 py-4">
                  <span class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">{{ item.kategori || '-' }}</span>
                </td>
                <td class="px-5 py-4 text-slate-600">{{ formatPrice(item.price) }}</td>
                <td class="px-5 py-4 font-semibold text-slate-900">{{ item.totalTerjual }} pcs</td>
                <td class="px-5 py-4 font-semibold text-green-700">{{ formatPrice(item.totalPendapatan) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { GET_MERCHANDISES } from '@/store/merchandise.module';
import { GET_TRANSACTIONS } from '@/store/transaction.module';
import Breadcrumb from '@/components/AppBreadcrumb.vue';
import AppSelect from '@/components/input/AppSelect.vue';
import type { Merchandise, Transaction } from '@/types/domain';

type TopMerchandise = Merchandise & {
  totalTerjual: number;
  totalPendapatan: number;
};

const store = useStore();
const isLoading = ref(true);
const selectedKategori = ref('Semua');

const merchandises = computed<Merchandise[]>(() => store.getters.merchandises?.data || []);
const transactions = computed<Transaction[]>(() => store.getters.transactions || []);

const allKategori = computed<string[]>(() => {
  const cats = merchandises.value
    .map((m) => m.kategori)
    .filter((category): category is string => Boolean(category?.trim()));
  return [...new Set(cats)].sort();
});
const kategoriFilterOptions = computed(() => [
  { value: 'Semua', label: 'Semua Kategori' },
  ...allKategori.value.map((kategori) => ({ value: kategori, label: kategori })),
]);

const filteredMerchandises = computed(() =>
  selectedKategori.value === 'Semua'
    ? merchandises.value
    : merchandises.value.filter((m) => m.kategori === selectedKategori.value)
);

const filteredMerchIds = computed(() =>
  new Set(filteredMerchandises.value.map((m) => m.id).filter((id): id is number => typeof id === 'number'))
);

const filteredTransactions = computed(() =>
  transactions.value.filter((t) => filteredMerchIds.value.has(t.merchandiseId))
);

const merchMap = computed<Map<number, Merchandise>>(() =>
  new Map(
    merchandises.value
      .filter((m): m is Merchandise & { id: number } => typeof m.id === 'number')
      .map((m) => [m.id, m])
  )
);

const totalTerjual = computed(() =>
  filteredTransactions.value.reduce((sum, t) => sum + (Number(t.qty) || 0), 0)
);

const totalPendapatan = computed(() =>
  filteredTransactions.value.reduce((sum, t) => {
    const merch = merchMap.value.get(t.merchandiseId);
    return sum + (Number(t.qty) || 0) * (Number(merch?.price) || 0);
  }, 0)
);

const kategoriTerlaris = computed<string | null>(() => {
  const tally: Record<string, number> = {};
  filteredTransactions.value.forEach((t) => {
    const kat = merchMap.value.get(t.merchandiseId)?.kategori;
    if (kat) tally[kat] = (tally[kat] || 0) + (Number(t.qty) || 0);
  });
  return Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
});

const chartOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  xaxis: { categories: allKategori.value },
  yaxis: { labels: { formatter: (v: number) => formatPrice(v) } },
  colors: ['#003793'],
  plotOptions: { bar: { borderRadius: 6 } },
  dataLabels: { enabled: false },
  tooltip: { y: { formatter: (v: number) => formatPrice(v) } },
}));

const chartSeries = computed(() => {
  const revenue: Record<string, number> = {};
  allKategori.value.forEach((k) => (revenue[k] = 0));
  transactions.value.forEach((t) => {
    const merch = merchMap.value.get(t.merchandiseId);
    const kat = merch?.kategori;
    if (kat && revenue[kat] !== undefined) {
      revenue[kat] += (Number(t.qty) || 0) * (Number(merch?.price) || 0);
    }
  });
  return [{ name: 'Pendapatan', data: allKategori.value.map((k) => revenue[k] || 0) }];
});

const top10 = computed<TopMerchandise[]>(() => {
  const tally: Record<number, { totalTerjual: number; totalPendapatan: number }> = {};
  filteredTransactions.value.forEach((t) => {
    const id = t.merchandiseId;
    if (typeof id !== 'number') return;
    if (!tally[id]) tally[id] = { totalTerjual: 0, totalPendapatan: 0 };
    const merch = merchMap.value.get(id);
    tally[id].totalTerjual += Number(t.qty) || 0;
    tally[id].totalPendapatan += (Number(t.qty) || 0) * (Number(merch?.price) || 0);
  });
  return Object.entries(tally)
    .map(([id, stats]) => ({ ...(merchMap.value.get(Number(id)) || {}), ...stats }))
    .sort((a, b) => b.totalTerjual - a.totalTerjual)
    .slice(0, 10);
});

function formatPrice(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

onMounted(async () => {
  try {
    await Promise.all([
      store.dispatch(GET_MERCHANDISES, { data: { limit: 1000 } }),
      store.dispatch(GET_TRANSACTIONS, { data: { limit: 1000 } }),
    ]);
  } catch (err) {
    console.error('Failed to load dashboard data:', err);
  } finally {
    isLoading.value = false;
  }
});
</script>
