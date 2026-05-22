<template>
  <div class="min-h-screen bg-slate-50">
    <!-- ── Page Header ─────────────────────────────────────────── -->
    <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6 mb-6">
      <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
      <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
      <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 class="text-2xl font-bold md:text-4xl">Dashboard</h1>
          <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
            Pantau dan kelola ringkasan statistik layanan, status pengajuan bantuan, serta progres donasi secara menyeluruh.
          </p>
        </div>
        <button
          class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#003793] shadow-lg transition-all hover:-translate-y-px hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/70 sm:w-auto"
          @click="fetchDashboard"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Refresh Data
        </button>
      </div>
    </section>

    <!-- ── KPI Scoreboard (Bento Grid) ──────────────────────────── -->
    <div class="mt-2 mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      
      <!-- Card 1: Pengajuan Perlu Proses -->
      <div 
        class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md cursor-pointer"
        @click="isPendingDropdownOpen = !isPendingDropdownOpen"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-bold text-slate-400">{{ kpiData.totalPengajuanPending.title }}</p>
            <p class="mt-2 text-3xl font-black text-slate-900">{{ kpiData.totalPengajuanPending.value }}</p>
          </div>
          <div class="text-indigo-500/80 transition-transform group-hover:scale-110">
            <svg class="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path d="M14.25 2.75H7A2.25 2.25 0 0 0 4.75 5v14A2.25 2.25 0 0 0 7 21.25h10A2.25 2.25 0 0 0 19.25 19v-9.25" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14.25 2.75v5A2.25 2.25 0 0 0 16.5 10h2.75" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9.25 14.25c0-1.05.86-1.9 1.92-1.9.8 0 1.48.46 1.78 1.13.3-.67.98-1.13 1.78-1.13 1.06 0 1.92.85 1.92 1.9 0 2.75-3.7 4.7-3.7 4.7s-3.7-1.95-3.7-4.7Z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div class="relative mt-4">
          <button 
            @click.stop="isPendingDropdownOpen = !isPendingDropdownOpen"
            class="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 transition-opacity hover:opacity-80"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Lihat Rincian</span>
          </button>

          <!-- Floating Tooltip -->
          <div 
            v-if="isPendingDropdownOpen"
            class="absolute bottom-full left-0 z-20 mb-3 w-52 rounded-xl bg-white border border-[#8c8c94] p-3.5 shadow-xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div class="space-y-2.5">
              <div v-for="(val, key) in kpiData.totalPengajuanPending.breakdown" :key="key" class="flex justify-between items-center">
                <span class="text-[10px] font-bold text-slate-500">{{ key === 'iom' ? 'Bantuan IOM' : key === 'bankes' ? 'Kesehatan' : 'OTA' }}</span>
                <span class="text-xs font-black text-slate-900">{{ val }}</span>
              </div>
            </div>
            <!-- Arrow -->
            <div class="absolute -bottom-[5px] left-4 h-2.5 w-2.5 rotate-45 bg-white border-b border-r border-[#8c8c94]"></div>
          </div>
        </div>
      </div>

      <!-- Card 2: Bantuan Disetujui -->
      <div 
        class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md cursor-pointer"
        @click="isApprovedDropdownOpen = !isApprovedDropdownOpen"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-bold text-slate-400">{{ kpiData.totalBantuanDisetujui.title }}</p>
            <p class="mt-2 text-3xl font-black text-slate-900">{{ kpiData.totalBantuanDisetujui.value }}</p>
          </div>
          <div class="text-blue-500/80 transition-transform group-hover:scale-110">
            <svg class="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path d="M12 3.75 4.5 6.75v5.625c0 4.238 2.832 8.05 7.5 9.375 4.668-1.325 7.5-5.137 7.5-9.375V6.75L12 3.75Z" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.75 12.15c0-1.05.82-1.9 1.85-1.9.62 0 1.16.3 1.4.78.24-.48.78-.78 1.4-.78 1.03 0 1.85.85 1.85 1.9 0 2.25-3.25 3.95-3.25 3.95s-3.25-1.7-3.25-3.95Z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="relative mt-4">
          <button 
            @click.stop="isApprovedDropdownOpen = !isApprovedDropdownOpen"
            class="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 transition-opacity hover:opacity-80"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Komposisi Bantuan</span>
          </button>

          <!-- Floating Tooltip -->
          <div 
            v-if="isApprovedDropdownOpen"
            class="absolute bottom-full left-0 z-20 mb-3 w-52 rounded-xl bg-white border border-[#8c8c94] p-3.5 shadow-xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div class="space-y-2.5">
              <div v-for="(val, key) in kpiData.totalBantuanDisetujui.breakdown" :key="key" class="flex justify-between items-center">
                <span class="text-[10px] font-bold text-slate-500">{{ key === 'iom' ? 'Bantuan IOM' : key === 'bankes' ? 'Kesehatan' : 'OTA' }}</span>
                <span class="text-xs font-black text-slate-900">{{ val }}</span>
              </div>
            </div>
            <!-- Arrow -->
            <div class="absolute -bottom-[5px] left-4 h-2.5 w-2.5 rotate-45 bg-white border-b border-r border-[#8c8c94]"></div>
          </div>
        </div>
      </div>

      <!-- Card 3: Dashboard Merchandise -->
      <div
        class="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-sky-200 hover:shadow-md cursor-pointer"
        @click="goToMerchandiseDashboard"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-bold text-slate-400">Merchandise</p>
            <p class="mt-2 text-3xl font-black text-slate-900">{{ kpiData.pesananMerchandise.value }}</p>
          </div>
          <div class="text-sky-500/80 transition-transform group-hover:scale-110">
            <svg class="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path d="M9 4.75 7 6.25l-3.25 1.5 2 4.75 2.5-1V20h7.5v-8.5l2.5 1 2-4.75-3.25-1.5-2-1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 4.75c.55 1.1 1.55 1.75 3 1.75s2.45-.65 3-1.75" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center gap-1 text-[11px] font-bold text-sky-600">
          <span>Kelola pesanan</span>
          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>

      <!-- Card 4: Total Donasi -->
      <div 
        class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-[#003793]/20 hover:shadow-md cursor-pointer"
        @click="isDonationDropdownOpen = !isDonationDropdownOpen"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-bold text-slate-400">Donasi Masuk</p>
            <p class="mt-2 text-xl font-black text-slate-900">{{ kpiData.totalDonasi.value }}</p>
          </div>
          <div class="text-[#003793]/70 transition-transform group-hover:scale-110">
            <svg class="h-9 w-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path d="M3.5 14.75h3.25l2.7 2.15a3.25 3.25 0 0 0 2.04.72h3.26c.85 0 1.55-.7 1.55-1.55s-.7-1.55-1.55-1.55h-3.1" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 14.75l1.75-1.35a3.1 3.1 0 0 1 1.9-.65h2.1a1.55 1.55 0 0 1 1.55 1.55" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17.25 7.5a3.25 3.25 0 1 0-6.5 0 3.25 3.25 0 0 0 6.5 0Z" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 5.95v3.1M12.75 7.5h2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div class="relative mt-4">
          <button 
            @click.stop="isDonationDropdownOpen = !isDonationDropdownOpen"
            class="flex items-center gap-1.5 text-[11px] font-bold text-[#003793] transition-opacity hover:opacity-80"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Sumber Dana</span>
          </button>

          <!-- Floating Tooltip -->
          <div 
            v-if="isDonationDropdownOpen"
            class="absolute bottom-full left-0 z-20 mb-3 w-52 rounded-xl bg-white border border-[#8c8c94] p-3.5 shadow-xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div class="space-y-2.5">
              <div v-for="(val, key) in kpiData.totalDonasi.breakdown" :key="key" class="flex justify-between items-center">
                <span class="text-[10px] font-bold text-slate-500">{{ key === 'iom' ? 'Donasi IOM' : 'Komitmen OTA' }}</span>
                <span class="text-xs font-black text-slate-900">{{ val }}</span>
              </div>
            </div>
            <!-- Arrow -->
            <div class="absolute -bottom-[5px] left-4 h-2.5 w-2.5 rotate-45 bg-white border-b border-r border-[#8c8c94]"></div>
          </div>
        </div>
      </div>

      <!-- Card 5: Total Anggota -->
      <div class="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-xs font-bold text-slate-400">Total Anggota</p>
            <p class="mt-2 text-3xl font-black text-slate-900">{{ kpiData.totalAnggota.value }}</p>
          </div>
          <div class="rounded-xl bg-slate-50 p-2.5 text-slate-600 transition-colors group-hover:bg-slate-100">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7">
              <path d="M15 19.25a6.5 6.5 0 0 0-13 0" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.5 12.25a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16.25 11.75 18 13.5l3.25-4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <p class="mt-4 text-[10px] font-bold tracking-tight text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block w-fit">
          {{ kpiData.totalAnggota.description }}
        </p>
      </div>

    </div>

    <!-- TOGGLE GRAFIK SECTION -->
    <div class="mb-6">
      <button 
        @click="isChartsVisible = !isChartsVisible"
        class="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:bg-blue-50/30 focus:outline-none"
      >
        <div class="flex items-center gap-4">
          <div class="rounded-xl bg-blue-50 p-2.5 text-blue-600 transition-colors group-hover:bg-blue-100">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7">
              <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75H3v-6.75Z" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25h-4.5V8.625Z" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75h-4.5V4.125Z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="text-left">
            <h4 class="text-xs font-bold text-blue-600">Analisis Data</h4>
            <span class="text-lg font-black text-slate-800">Visualisasi Statistik & Grafik</span>
          </div>
        </div>
        <svg 
          class="w-5 h-5 text-slate-400 transition-transform duration-300" 
          :class="{ 'rotate-180': isChartsVisible }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
    </div>

    <div v-if="isChartsVisible">
      <!-- TUGAS 4: GRAFIK (CHARTS) -->
      <div class="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        
        <!-- Grafik Kiri (Tren Pengajuan) -->
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ">
        <div class="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 class="text-slate-700 font-bold text-lg">Tren Pengajuan Masuk</h3>
            <p class="text-xs text-slate-500">Pilih rentang waktu untuk melihat perubahan tren</p>
          </div>
          <div class="min-w-[160px]">
            <select
              v-model="selectedTrendRange"
              @change="handleTrendRangeChange"
              class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option v-for="range in trendRangeOptions" :key="range.value" :value="range.value">
                {{ range.label }}
              </option>
            </select>
          </div>
        </div>
        <apexchart 
          :key="trenChartKey"
          type="line" 
          height="300" 
          :options="trenChartOptions" 
          :series="trenChartSeries" 
        />
      </div>

      <!-- Grafik Kanan (Distribusi Status) -->
      <div class="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ">
        <h3 class="text-slate-700 font-bold text-lg mb-4">Distribusi Status Bantuan</h3>
        <div class="flex-1 flex items-center justify-center">
          <apexchart 
            :key="statusChartKey"
            type="donut" 
            height="320" 
            :options="statusChartOptions" 
            :series="statusChartSeries" 
          />
        </div>
      </div>

      <!-- Grafik Bawah (Penerima Bantuan per Tahun) - Bar Chart -->
      <div class="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm  lg:col-span-2">
        <h3 class="text-slate-700 font-bold text-lg mb-4">Penerima Bantuan per Tahun</h3>
        <div v-if="penerimaChartSeries[0]?.data?.length > 0" class="flex-1">
          <apexchart 
            type="bar" 
            height="300" 
            :options="penerimaChartOptions" 
            :series="penerimaChartSeries" 
          />
        </div>
        <div v-else class="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg min-h-[300px] bg-slate-50">
          <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span class="text-slate-500 font-medium">Belum ada data penerima bantuan</span>
        </div>
      </div>

    </div>

    <!-- AREA PLACEHOLDER GRAFIK KHUSUS BANKES & OTA -->
    <div class="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
      
      <!-- Grafik Kiri (Kapasitas OTA) -->
      <div class="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ">
        <h3 class="text-slate-700 font-bold text-lg mb-4">Kapasitas Orang Tua Asuh</h3>
        <div v-if="otaCapacityChartSeries.length > 0" class="flex-1 flex items-center justify-center">
          <apexchart 
            type="donut" 
            height="320" 
            :options="otaCapacityChartOptions" 
            :series="otaCapacityChartSeries" 
          />
        </div>
        <div v-else class="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg min-h-[320px] bg-slate-50">
          <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span class="text-slate-500 font-medium text-sm">Belum ada data kapasitas orang tua asuh</span>
        </div>
      </div>

      <!-- Grafik Kanan (Status Tagihan) -->
      <div class="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ">
        <h3 class="text-slate-700 font-bold text-lg mb-4">Status Tagihan Donatur (OTA)</h3>
        <div v-if="(otaBillingChartSeries[0]?.data?.[0] || 0) + (otaBillingChartSeries[0]?.data?.[1] || 0) > 0" class="flex-1 mt-6">
          <apexchart 
            type="bar" 
            height="260" 
            :options="otaBillingChartOptions" 
            :series="otaBillingChartSeries" 
          />
        </div>
        <div v-else class="flex-1 mt-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg min-h-[260px] bg-slate-50">
          <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span class="text-slate-500 font-medium text-sm">Belum ada data tagihan donatur</span>
        </div>
      </div>

    </div>
    </div> <!-- END of isChartsVisible Wrapper -->

    <!-- ── Quick Navigation Links ──────────────────────────────── -->
    <div class="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <!-- Dashboard Pembayaran -->
      <div 
        class="group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md cursor-pointer"
        @click="goToPaymentDashboard"
      >
        <div class="rounded-2xl bg-blue-50 p-4 text-blue-600 transition-colors group-hover:bg-blue-100">
          <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7">
            <path d="M4 19.25h16" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.25 16.25v-4.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.75 16.25v-8.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.25 16.25v-11.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.75 5.75h5.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.75 8.75h3.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-blue-600">Keuangan & Donasi</p>
          <h3 class="text-lg font-black text-slate-800">Dashboard Pembayaran</h3>
          <p class="mt-1 text-sm text-slate-500 leading-relaxed">
            Monitor aliran dana, konfirmasi manual, dan rekonsiliasi Midtrans.
          </p>
        </div>
        <div class="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
          <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>

      <!-- Dashboard Merchandise -->
      <div 
        class="group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-sky-200 hover:shadow-md cursor-pointer"
        @click="goToMerchandiseDashboard"
      >
        <div class="rounded-2xl bg-sky-50 p-4 text-sky-600 transition-colors group-hover:bg-sky-100">
          <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7">
            <path d="M4.5 8.5 12 4.5l7.5 4-7.5 4-7.5-4Z" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.5 8.5v7l7.5 4 7.5-4v-7" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 12.5v7" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8.25 15.75v-2M12 16.75v-3M15.75 17.5v-4.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-sky-600">E-Commerce & Logistik</p>
          <h3 class="text-lg font-black text-slate-800">Dashboard Merchandise</h3>
          <p class="mt-1 text-sm text-slate-500 leading-relaxed">
            Kelola stok produk, pesanan baru, dan status pengiriman barang.
          </p>
        </div>
        <div class="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
          <svg class="h-6 w-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
    </div>

    <!-- ── Data Tables Section ────────────────────────────────── -->
    <div class="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
      
      <!-- Tabel Kiri: Pengajuan Bantuan Terbaru -->
      <div class="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <h3 class="text-lg font-black text-slate-800">Pengajuan Bantuan Terbaru</h3>
            <p class="text-xs font-medium text-slate-500">Antrian verifikasi berkas mahasiswa.</p>
          </div>
          <div class="rounded-lg bg-slate-50 p-2 text-slate-400">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-blue-900">
              <tr>
                <th class="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-blue-100">Nama Pemohon</th>
                <th class="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-blue-100">NIM</th>
                <th class="px-6 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-blue-100">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="submission in recentSubmissions" :key="submission.id" class="transition-colors hover:bg-blue-50/30">
                <td class="px-6 py-4">
                  <p class="font-bold text-slate-900">{{ submission.name }}</p>
                  <p class="mt-0.5 text-[10px] font-bold uppercase tracking-tight text-slate-400">{{ submission.type }} • {{ submission.date }}</p>
                </td>
                <td class="px-6 py-4 font-mono font-medium text-slate-600">{{ submission.nim }}</td>
                <td class="px-6 py-4 text-center">
                  <span 
                    class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tight"
                    :class="{
                      'bg-slate-50 text-slate-400 border-slate-200': submission.status === 'Tidak Diketahui',
                      'bg-indigo-50 text-indigo-700 border-indigo-100': submission.status === 'Verifikasi Berkas',
                      'bg-purple-50 text-purple-700 border-purple-100': submission.status === 'Wawancara',
                      'bg-amber-50 text-amber-700 border-amber-100': submission.status === 'Menunggu',
                      'bg-blue-50 text-blue-700 border-blue-100': submission.status === 'Diproses',
                      'bg-emerald-50 text-emerald-700 border-emerald-100': submission.status === 'Disetujui',
                      'bg-rose-50 text-rose-700 border-rose-100': submission.status === 'Ditolak'
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
      <div class="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <h3 class="text-lg font-black text-slate-800">Log Aktivitas Terbaru</h3>
            <p class="text-xs font-medium text-slate-500">Riwayat perubahan status terakhir.</p>
          </div>
          <div class="rounded-lg bg-slate-50 p-2 text-slate-400">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-blue-900">
              <tr>
                <th class="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-blue-100">Admin</th>
                <th class="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-blue-100">Waktu</th>
                <th class="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-blue-100">Perubahan Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="log in activityLogs" :key="log.id" class="transition-colors hover:bg-blue-50/30">
                <td class="px-6 py-4 font-bold text-slate-900">{{ log.admin }}</td>
                <td class="px-6 py-4 font-medium text-slate-500 text-xs">{{ log.time }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">{{ log.oldStatus }}</span>
                    <svg class="h-3 w-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <span 
                      class="rounded px-1.5 py-0.5 text-[10px] font-bold"
                      :class="{
                        'bg-slate-100 text-slate-400': log.newStatus === 'Tidak Diketahui',
                        'bg-indigo-50 text-indigo-700': log.newStatus === 'Verifikasi Berkas',
                        'bg-purple-50 text-purple-700': log.newStatus === 'Wawancara',
                        'bg-yellow-50 text-yellow-600': log.newStatus === 'Menunggu',
                        'bg-blue-50 text-blue-700': log.newStatus === 'Diproses',
                        'bg-emerald-50 text-emerald-700': log.newStatus === 'Disetujui',
                        'bg-rose-50 text-rose-700': log.newStatus === 'Ditolak'
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

    <!-- ── Developer Tools Section ────────────────────────────── -->
    <div class="mt-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0">
      <div class="mb-4 flex items-center gap-3">
        <div class="rounded-lg bg-slate-200 p-2 text-slate-600">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div>
          <h4 class="text-sm font-black text-slate-700 uppercase tracking-widest">Developer Sandbox</h4>
          <p class="text-xs text-slate-500 font-medium">Tools untuk pengujian data csv dummy.</p>
        </div>
      </div>

      <div class="max-w-md">
        <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Import Dummy CSV</label>
        <div class="flex items-center gap-3">
          <input
            type="file"
            accept=".csv"
            class="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[11px] file:font-black file:uppercase file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer transition-all"
            @change="handleCsvUpload"
          />
        </div>
      </div>

      <div v-if="csvRows.length" class="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
          <p class="text-[10px] font-black uppercase text-slate-400">Preview Data ({{ csvRows.length - 1 }} baris)</p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-[10px]">
            <thead>
              <tr class="bg-slate-50">
                <th v-for="header in csvRows[0]" :key="header" class="border-b border-slate-200 px-4 py-2 text-left font-bold text-slate-500 uppercase">{{ header }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(row,i) in csvRows.slice(1,6)" :key="i">
                <td v-for="(cell,j) in row" :key="j" class="px-4 py-2 text-slate-600 font-medium">{{ cell }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import ApiService from "@/store/api.service"

const isPendingDropdownOpen = ref(false)
const isApprovedDropdownOpen = ref(false)
const isDonationDropdownOpen = ref(false)
const isChartsVisible = ref(false)
const router = useRouter()
const selectedTrendRange = ref('week')
const trendRangeOptions = [
  { value: 'week', label: '7 Hari' },
  { value: 'month', label: '1 Bulan' },
  { value: '3months', label: '3 Bulan' },
  { value: 'year', label: '1 Tahun' },
  { value: 'all', label: 'Semua' }
]

// ================= Ringkasan =================
const kpiData = ref({
  totalPengajuanPending: { 
    title: "Pengajuan Perlu Proses", 
    value: 0,
    breakdown: {
      iom: 0,
      bankes: 0,
      ota: 0
    }
  },
  totalBantuanDisetujui: { 
    title: "Bantuan Disetujui (Bulan Ini)", 
    value: 0,
    breakdown: { iom: 0, bankes: 0, ota: 0 }
  },
  pesananMerchandise: { title: "Pesanan Merchandise Baru", value: 0 },
  totalDonasi: { 
    title: "Donasi Terkumpul", 
    value: "Rp 0",
    breakdown: { iom: "Rp 0", ota: "Rp 0" }
  },
  totalAnggota: { title: "Total Anggota", value: 0, description: "" }
})

const trenChartKey = ref(0)
const statusChartKey = ref(0)

const trenChartSeries = ref<any[]>([])
const trenChartOptions = ref({
  chart: { type: 'line', toolbar: { show: false } },
  stroke: { curve: 'smooth', width: 3 },
  xaxis: { categories: [] as string[] },
  colors: ['#3B82F6']
})

const statusChartSeries = ref<number[]>([])
const statusChartOptions = ref({
  chart: { type: 'donut' },
  labels: [] as string[],
  colors: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'],
  legend: { show: true, position: 'bottom' }
})

const penerimaChartSeries = ref([{ name: 'Total Penerima Bantuan', data: [] as number[] }])
const penerimaChartOptions = ref({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
  xaxis: { categories: [] as string[] },
  colors: ['#8B5CF6'],
  dataLabels: { enabled: false }
})

// === GRAFIK BANKES & OTA ===
const otaCapacityChartSeries = ref<number[]>([])
const otaCapacityChartOptions = ref({
  chart: { type: 'donut' },
  labels: ['Sudah Terpakai', 'Sisa Kosong'],
  colors: ['#F59E0B', '#10B981'], // Orange for used, Green for free
  legend: { show: true, position: 'bottom' }
})

const otaBillingChartSeries = ref([{ name: 'Jumlah Donatur', data: [] as number[] }])
const otaBillingChartOptions = ref({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, columnWidth: '40%' } },
  xaxis: { categories: ['Sudah Lunas', 'Menunggak'] },
  colors: ['#3B82F6'],
  dataLabels: { enabled: false }
})

const recentSubmissions = ref<any[]>([])
const activityLogs = ref<any[]>([])

const formatDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const normalizeDateKey = (value: string) => {
  if (!value) return ''
  if (value.length >= 10) return value.slice(0, 10)
  return formatDateKey(new Date(value))
}

const formatMonthLabel = (dateValue: string) => {
  const date = new Date(dateValue)
  return date.toLocaleDateString('id-ID', { month: 'short' })
}

const formatTrendLabel = (dateValue: string, range: string) => {
  const date = new Date(dateValue)

  if (range === 'week') {
    return getDayName(date)
  }

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short'
  })
}

const buildTrendCategories = (items: Array<{ date: string }>, range: string) => {
  const normalizedRange = String(range).toLowerCase()

  if (normalizedRange === 'week') {
    return items.map((x) => formatTrendLabel(x.date, range))
  }

  if (normalizedRange === 'year') {
    return items.map((x) => {
      const date = new Date(x.date)
      return date.getDate() === 1 ? formatMonthLabel(x.date) : ''
    })
  }

  const step = normalizedRange === '3months' ? 14 : 7
  return items.map((x, index) => (index % step === 0 ? formatTrendLabel(x.date, range) : ''))
}

const loadCharts = async (range = selectedTrendRange.value) => {
  try {
    const chartRes: any = await ApiService.get('/dashboard/charts', { range })
    const charts = chartRes.data || chartRes

    const trendItems = charts.trenPengajuan || []
    const rangeMap: Record<string, number | null> = {
      week: 7,
      month: 30,
      '3months': 90,
      year: 365,
      all: null
    }
    const selectedDays = rangeMap[String(range).toLowerCase()] ?? 7
    let filledTrendItems = trendItems

    if (selectedDays !== null) {
      const totalsByDate = new Map(
        trendItems.map((item: any) => [normalizeDateKey(String(item.date)), Number(item.total) || 0])
      )

      const endDate = new Date()
      endDate.setHours(23, 59, 59, 999)
      const startDate = new Date(endDate)
      startDate.setDate(endDate.getDate() - (selectedDays - 1))
      startDate.setHours(0, 0, 0, 0)

      const filled: Array<{ date: string; total: number }> = []
      const cursor = new Date(startDate)

      while (cursor <= endDate) {
        const key = formatDateKey(cursor)
        filled.push({ date: key, total: totalsByDate.get(key) || 0 })
        cursor.setDate(cursor.getDate() + 1)
      }

      filledTrendItems = filled
    }

    trenChartSeries.value = [{
      name: 'Pengajuan',
      data: filledTrendItems.map((x: any) => Number(x.total) || 0)
    }]

    trenChartOptions.value = {
      ...trenChartOptions.value,
      xaxis: {
        categories: buildTrendCategories(filledTrendItems, range)
      }
    }

    trenChartKey.value++

    const statusItems = (charts.distribusiStatus || []).filter((x: any) => x.currentStatus !== 'TIDAK_DIKETAHUI')

    statusChartSeries.value = statusItems.map((x: any) => Number(x.total) || 0)
    statusChartOptions.value = {
      ...statusChartOptions.value,
      labels: statusItems.map((x: any) => mapStatus(x.currentStatus))
    }

    statusChartKey.value++

    penerimaChartSeries.value = [{
      name: 'Total Penerima Bantuan',
      data: charts.penerimaPerTahun?.map((x: any) => Number(x.total) || 0) || []
    }]

    penerimaChartOptions.value = {
      ...penerimaChartOptions.value,
      xaxis: {
        categories: charts.penerimaPerTahun?.map((x: any) => x.year) || []
      }
    }
  } catch (err) {
    console.error('Failed to load dashboard charts:', err)
  }
}

const handleTrendRangeChange = () => {
  void loadCharts(selectedTrendRange.value)
}

const goToPaymentDashboard = () => {
  router.push('/dashboard-pembayaran')
}

const goToMerchandiseDashboard = () => {
  router.push('/merchandise-dashboard')
}

const fetchDashboard = async () => {
  try {
    const statsRes: any = await ApiService.get('/dashboard/stats')
    const stats = statsRes.data || statsRes

    // Init the basic IOM values
    let totalIOMPending = stats.totalPending || 0
    let totalBankesPending = 0
    let totalOTAPending = 0

    let totalIOMApproved = stats.approvedThisMonth || 0
    let totalBankesApproved = 0
    let totalOTAApproved = 0

    let totalIOMDonasi = stats.totalDonasi || 0
    let totalOTADonasiAmount = 0

    try {
      // Hit Bankes Asli API to aggregate data (Via Nginx Proxy)
      const bankesUrl = process.env.VUE_APP_API_BANKES_URL || '/ext-api/bankes'
      const responseBankes = await fetch(bankesUrl)
      const bankesRes = await responseBankes.json()
      const bankesData = bankesRes.data || []
      
      // Count pending (Logika baru berdasarkan bankesStatus: 'unverified')
      totalBankesPending = bankesData.filter((mhs: any) => mhs.bankesStatus === 'unverified').length
      
      // Count approved / verified (Logika baru berdasarkan bankesStatus: 'verified')
      totalBankesApproved = bankesData.filter((mhs: any) => mhs.bankesStatus === 'verified').length

      // Hitungan dummy pendings OTA (bisa disesuaikan lagi nanti)
      totalOTAPending = bankesData.length > 2 ? 1 : 0 
      totalOTAApproved = 0 
    } catch (e) {
      console.warn("Failed to fetch Bankes data:", e)
    }

    try {
      // Hit OTA-KU API. (Via Nginx Proxy)
      const otaUrl = process.env.VUE_APP_API_OTA_URL || '/ext-api/ota'
      const response = await fetch(otaUrl)
      const otaRes = await response.json()
      const otaData = otaRes.data || []
      
      // Sum the funds from all OTAs (Asumsi tim merek mengeluarkan property 'funds')
      totalOTADonasiAmount = otaData.reduce((sum: number, ota: any) => sum + (ota.funds || 0), 0)

      // Hitung Kapasitas OTA
      const totalCapacity = otaData.reduce((sum: number, ota: any) => sum + (ota.maxCapacity || 0), 0)
      const usedCapacity = otaData.reduce((sum: number, ota: any) => sum + (ota.usedCapacity || 0), 0)
      otaCapacityChartSeries.value = [usedCapacity, Math.max(0, totalCapacity - usedCapacity)]

      // Hitung Status Tagihan Donatur
      let lunasCount = 0
      let nunggakCount = 0
      
      otaData.forEach((ota: any) => {
        if (ota.paymentStatus === 'lunas') lunasCount++
        else if (ota.paymentStatus === 'menunggak') nunggakCount++
      })
      
      otaBillingChartSeries.value = [{ name: 'Jumlah Donatur', data: [lunasCount, nunggakCount] }]

    } catch (e) {
      console.warn("Failed to fetch OTA-KU data:", e)
    }

    // Apply Pendings
    kpiData.value.totalPengajuanPending.value = totalIOMPending + totalBankesPending + totalOTAPending
    kpiData.value.totalPengajuanPending.breakdown.iom = totalIOMPending
    kpiData.value.totalPengajuanPending.breakdown.bankes = totalBankesPending
    kpiData.value.totalPengajuanPending.breakdown.ota = totalOTAPending

    // Apply Approved
    kpiData.value.totalBantuanDisetujui.value = totalIOMApproved + totalBankesApproved + totalOTAApproved
    kpiData.value.totalBantuanDisetujui.breakdown.iom = totalIOMApproved
    kpiData.value.totalBantuanDisetujui.breakdown.bankes = totalBankesApproved
    kpiData.value.totalBantuanDisetujui.breakdown.ota = totalOTAApproved

    // Apply Donasi
    const totalDonasiAll = totalIOMDonasi + totalOTADonasiAmount
    kpiData.value.totalDonasi.value = "Rp " + formatNumber(totalDonasiAll)
    kpiData.value.totalDonasi.breakdown.iom = "Rp " + formatNumber(totalIOMDonasi)
    kpiData.value.totalDonasi.breakdown.ota = "Rp " + formatNumber(totalOTADonasiAmount)

    kpiData.value.pesananMerchandise.value = stats.pesananBaru || 0
    kpiData.value.totalAnggota.value = stats.totalAnggota
    kpiData.value.totalAnggota.description =
      `+${stats.anggotaBaru} anggota baru bulan ini`

    await loadCharts(selectedTrendRange.value)

    const recentRes: any = await ApiService.get('/dashboard/recent')
    const recent = recentRes.data || recentRes

    recentSubmissions.value = recent.pengajuanTerbaru?.map((x:any)=>({
      id: x.id,
      name: x.name,
      nim: x.nim,
      type: x.type,
      date: formatDate(x.submittedAt),
      status: mapStatus(x.pengajuanStatus?.currentStatus)
    })) || []

    activityLogs.value = recent.logAktivitas?.map((x:any)=>({
      id: Math.random(),
      admin: x.changedBy === 'SEEDER' ? 'Sistem' : x.changedBy,
      time: formatDate(x.changedAt),
      oldStatus: mapStatus(x.oldStatus),
      newStatus: mapStatus(x.newStatus)
    })) || []

  } catch (err) {
    console.error("Dashboard error:", err)
  }
}

// helper
function formatNumber(num:number){
  return new Intl.NumberFormat('id-ID').format(num || 0)
}

function formatDate(date:string){
  if (!date) return "-"
  return new Date(date).toLocaleDateString('id-ID')
}
// helper nama hari
function getDayName(date: Date) {
  const days = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']
  return days[date.getDay()]
}

function mapStatus(status:string){
  const map:any = {
    VERIFIKASI_BERKAS: 'Verifikasi Berkas',
    DIPANGGIL_WAWANCARA: 'Wawancara',
    KEPUTUSAN_DITERIMA: 'Disetujui',
    KEPUTUSAN_DITOLAK: 'Ditolak',
    TIDAK_DIKETAHUI: 'Tidak Diketahui'
  }
  return map[status] || status
}

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
onMounted(fetchDashboard)

</script>