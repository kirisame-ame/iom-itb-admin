<template>
  <div class="flex h-screen overflow-hidden bg-gray-200 font-sans">
    <Sidebar />

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <Header />
      <main ref="mainScrollRef" class="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 relative">
        <div class="p-3 sm:p-4 md:p-6 lg:p-8">
          <slot />
        </div>
      </main>
    </div>

    <!-- Floating Action Button for Service Portal -->
    <router-link
      to="/select"
      class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-800 text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 group"
      title="Kembali ke Pilihan Aplikasi"
    >
      <svg
        class="h-6 w-6 transition-transform group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        ></path>
      </svg>
      <!-- Tooltip -->
      <span class="pointer-events-none absolute bottom-[calc(100%+8px)] right-0 bg-slate-800 text-white text-[12px] font-medium px-3 py-1.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Pilihan Aplikasi
      </span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from './AppHeader.vue'
import Sidebar from './AppSidebar.vue'

const route = useRoute()
const mainScrollRef = ref<HTMLElement | null>(null)

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    if (mainScrollRef.value) {
      mainScrollRef.value.scrollTop = 0
      mainScrollRef.value.scrollLeft = 0
    }
  }
)
</script>
