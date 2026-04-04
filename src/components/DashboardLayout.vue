<template>
  <div class="flex h-screen bg-gray-200 font-roboto">
    <Sidebar />

    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />

      <main class="flex-1 overflow-x-hidden overflow-y-auto" :class="isDashboard ? 'bg-white' : 'bg-gray-200'">
        <div :class="isDashboard ? 'p-6 md:p-8' : 'container mx-auto px-6 py-8'">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './AppSidebar.vue'
import Header from './AppHeader.vue'

const route = useRoute()
const isDashboard = computed(() => route.name === 'Dashboard' || route.path === '/dashboard')
</script>
