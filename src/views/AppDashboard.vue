<template>
  <div class="bg-slate-50 min-h-screen p-6">
    <!-- ── Page Header ─────────────────────────────────────────── -->
    <div class="pb-4">
      <h1 class="text-3xl font-bold text-blue-900 tracking-tight">Dashboard</h1>
      <p class="text-sm text-slate-500 mt-2">Kelola dan tinjau semua pengajuan bantuan mahasiswa</p>
    </div>

    <!-- TUGAS 2 & 3: KPI CARDS GRID (REVISI 5 CARDS) -->
    <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 mt-2 mb-8">
      
      <!-- Card 1: Pengajuan Perlu Proses -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <h3 class="text-slate-500 text-sm font-medium">{{ kpiData.totalPengajuanPending.title }}</h3>
          <div class="p-2 bg-orange-50 text-orange-500 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-3xl font-bold text-slate-800">{{ kpiData.totalPengajuanPending.value }}</p>
        </div>
      </div>

      <!-- Card 2: Bantuan Disetujui -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <h3 class="text-slate-500 text-sm font-medium">{{ kpiData.totalBantuanDisetujui.title }}</h3>
          <div class="p-2 bg-green-50 text-green-500 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-3xl font-bold text-slate-800">{{ kpiData.totalBantuanDisetujui.value }}</p>
        </div>
      </div>

      <!-- Card 3: Pesanan Merchandise -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <h3 class="text-slate-500 text-sm font-medium">{{ kpiData.pesananMerchandise.title }}</h3>
          <div class="p-2 bg-blue-50 text-blue-500 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-3xl font-bold text-slate-800">{{ kpiData.pesananMerchandise.value }}</p>
        </div>
      </div>

      <!-- Card 4: Total Donasi -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <h3 class="text-slate-500 text-sm font-medium">{{ kpiData.totalDonasi.title }}</h3>
          <div class="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-xl font-bold text-slate-800">{{ kpiData.totalDonasi.value }}</p>
        </div>
      </div>

      <!-- Card 5: Total Anggota -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <h3 class="text-slate-500 text-sm font-medium">{{ kpiData.totalAnggota.title }}</h3>
          <div class="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-3xl font-bold text-slate-800">{{ kpiData.totalAnggota.value }}</p>
          <p class="text-xs text-green-500 mt-1 relative top-2 font-medium">{{ kpiData.totalAnggota.description }}</p>
        </div>
      </div>

    </div>

    <!-- TUGAS 4: GRAFIK (CHARTS) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      <!-- Grafik Kiri (Tren Pengajuan) -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 class="text-slate-700 font-bold text-lg mb-4">Tren Pengajuan Masuk</h3>
        <apexchart 
          type="line" 
          height="300" 
          :options="trenChartOptions" 
          :series="trenChartSeries" 
        />
      </div>

      <!-- Grafik Kanan (Distribusi Status) -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h3 class="text-slate-700 font-bold text-lg mb-4">Distribusi Status Bantuan</h3>
        <div class="flex-1 flex items-center justify-center">
          <apexchart 
            type="donut" 
            height="320" 
            :options="statusChartOptions" 
            :series="statusChartSeries" 
          />
        </div>
      </div>

      <!-- Grafik Bawah (Penerima Bantuan per Tahun) - Bar Chart -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 lg:col-span-2">
        <h3 class="text-slate-700 font-bold text-lg mb-4">Penerima Bantuan per Tahun</h3>
        <apexchart 
          type="bar" 
          height="300" 
          :options="penerimaChartOptions" 
          :series="penerimaChartSeries" 
        />
      </div>

    </div>

    <!-- TABEL BAWAH: PENGAJUAN & LOG AKTIVITAS -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
      
      <!-- Tabel Kiri: Pengajuan Bantuan Terbaru -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 bg-white">
          <h3 class="text-slate-700 font-bold text-lg">Pengajuan Bantuan Terbaru</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm text-left">
            <thead class="bg-slate-50 text-slate-500">
              <tr>
                <th class="px-6 py-3 font-semibold">Nama Pemohon</th>
                <th class="px-6 py-3 font-semibold">NIM</th>
                <th class="px-6 py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="submission in recentSubmissions" :key="submission.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-800">
                  {{ submission.name }}
                  <div class="text-xs text-slate-400 mt-1">{{ submission.type }} &bull; {{ submission.date }}</div>
                </td>
                <td class="px-6 py-4 text-slate-600">{{ submission.nim }}</td>
                <td class="px-6 py-4 text-center">
                  <span 
                    class="px-3 py-1 text-xs font-semibold rounded-full"
                    :class="{
                      'bg-yellow-50 text-yellow-600': submission.status === 'Menunggu',
                      'bg-blue-50 text-blue-600': submission.status === 'Diproses',
                      'bg-green-50 text-green-600': submission.status === 'Disetujui',
                      'bg-red-50 text-red-600': submission.status === 'Ditolak'
                    }"
                  >
                    {{ submission.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabel Kanan: Log Aktivitas Terbaru -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 bg-white">
          <h3 class="text-slate-700 font-bold text-lg">Log Aktivitas Terbaru</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm text-left">
            <thead class="bg-slate-50 text-slate-500">
              <tr>
                <th class="px-6 py-3 font-semibold">Admin</th>
                <th class="px-6 py-3 font-semibold">Waktu</th>
                <th class="px-6 py-3 font-semibold">Perubahan Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="log in activityLogs" :key="log.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-800">{{ log.admin }}</td>
                <td class="px-6 py-4 text-slate-500 text-xs">{{ log.time }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2 text-xs font-medium">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded">{{ log.oldStatus }}</span>
                    <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    <span 
                      class="px-2 py-1 rounded"
                      :class="{
                        'bg-blue-50 text-blue-600': log.newStatus === 'Diproses',
                        'bg-green-50 text-green-600': log.newStatus === 'Disetujui',
                        'bg-red-50 text-red-600': log.newStatus === 'Ditolak'
                      }"
                    >
                      {{ log.newStatus }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- CSV Upload (Dev Only) -->
    <div
      class="mt-6 p-4 border border-dashed border-gray-400 rounded-md bg-gray-50 max-w-md"
    >
      <p class="text-sm font-semibold text-gray-600 mb-2">
        Upload Dummy CSV
      </p>

      <input
        type="file"
        accept=".csv"
        class="block w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
        @change="handleCsvUpload"
      />

      <div v-if="csvRows.length" class="mt-3 overflow-x-auto">

        <p class="text-xs text-gray-500 mb-1">
          {{ csvRows.length - 1 }} rows loaded
        </p>

        <table class="text-xs border-collapse w-full">

          <thead>
            <tr>
              <th
                v-for="header in csvRows[0]"
                :key="header"
                class="border border-gray-300 bg-gray-200 px-2 py-1 text-left"
              >
                {{ header }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row,i) in csvRows.slice(1,6)" :key="i">
              <td
                v-for="(cell,j) in row"
                :key="j"
                class="border border-gray-300 px-2 py-1"
              >
                {{ cell }}
              </td>
            </tr>
          </tbody>

        </table>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

import { ref } from "vue"
import VueApexCharts from "vue3-apexcharts"

const kpiData = ref({
  totalPengajuanPending: { title: "Pengajuan Perlu Proses", value: 12, color: "text-orange-500" },
  totalBantuanDisetujui: { title: "Bantuan Disetujui (Bulan Ini)", value: 45, color: "text-green-500" },
  pesananMerchandise: { title: "Pesanan Merchandise Baru", value: 5, color: "text-blue-500" },
  totalDonasi: { title: "Donasi Terkumpul", value: "Rp 25.000.000", color: "text-emerald-500" },
  totalAnggota: { title: "Total Anggota", value: 1500, description: "+15 anggota baru bulan ini", color: "text-indigo-500" }
});

const tPengajuan = ref([12, 19, 3, 5, 2, 0, 8]);
const tLabels = ref(['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']);

const trenChartSeries = ref([{ name: 'Pengajuan', data: tPengajuan.value }]);
const trenChartOptions = ref({
  chart: { type: 'line', toolbar: { show: false } },
  stroke: { curve: 'smooth', width: 3 },
  xaxis: { categories: tLabels.value },
  colors: ['#3B82F6']
});

const statusChartSeries = ref([45, 12, 5, 20]);
const statusChartOptions = ref({
  chart: { type: 'donut' },
  labels: ['Disetujui', 'Menunggu', 'Ditolak', 'Diproses'],
  colors: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'],
  dataLabels: { enabled: true },
  legend: { position: 'bottom' }
});

const penerimaChartSeries = ref([{
  name: 'Total Penerima Bantuan',
  data: [120, 185, 240, 320]
}]);
const penerimaChartOptions = ref({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { 
    bar: { 
      borderRadius: 4, 
      horizontal: false,
      columnWidth: '50%'
    } 
  },
  xaxis: { categories: ['2023', '2024', '2025', '2026'] },
  colors: ['#8B5CF6'], // Ungu
  dataLabels: { enabled: false }
});

const recentSubmissions = ref([
  { id: 1, name: "Ahmad Budi", nim: "13523101", type: "Bantuan UKT", date: "2026-04-25", status: "Menunggu" },
  { id: 2, name: "Siti Rahma", nim: "13523102", type: "Bantuan Biaya Hidup", date: "2026-04-24", status: "Diproses" },
  { id: 3, name: "Rizky Fauzi", nim: "13523103", type: "Bantuan UKT", date: "2026-04-23", status: "Disetujui" }
]);

const activityLogs = ref([
  { id: 101, admin: "Dr. Ayi Purbasari", time: "10 menit yang lalu", oldStatus: "Menunggu", newStatus: "Diproses" },
  { id: 102, admin: "Orvin Andika", time: "1 jam yang lalu", oldStatus: "Diproses", newStatus: "Disetujui" }
]);

const csvRows=ref<string[][]>([])

function handleCsvUpload(event:Event){

const file=(event.target as HTMLInputElement).files?.[0]

if(!file)return

const reader=new FileReader()

reader.onload=(e)=>{

const text=e.target?.result as string

csvRows.value=text
.trim()
.split("\n")
.map(line=>line.split(",").map(cell=>cell.trim()))

}

reader.readAsText(file)

}

</script>