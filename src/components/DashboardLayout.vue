<template>
  <div class="flex h-screen overflow-hidden bg-gray-200 font-inter">
    <Sidebar />

    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <Header />

      <main class="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
        <div class="p-3 sm:p-4 md:p-6 lg:p-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './AppSidebar.vue'
import Header from './AppHeader.vue'
</script>
