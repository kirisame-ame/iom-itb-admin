<template>
  <div>
    <Breadcrumb breadcrumb="" />
    <!--Banner get you to github repo-->
    <Banner />
    <div class="mt-4">
      <h1>Selamat Datang, Admin IOM.</h1>
    </div>

    <!-- CSV Upload (dev only) -->
    <div
      class="mt-6 p-4 border border-dashed border-gray-400 rounded-md bg-gray-50 max-w-md"
    >
      <p class="text-sm font-semibold text-gray-600 mb-2">Upload Dummy CSV</p>
      <input
        type="file"
        accept=".csv"
        class="block w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
        @change="handleCsvUpload"
      />
      <div v-if="csvRows.length" class="mt-3 overflow-x-auto">
        <p class="text-xs text-gray-500 mb-1">
          {{ csvRows.length - 1 }} rows loaded (showing first 5)
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
            <tr v-for="(row, i) in csvRows.slice(1, 6)" :key="i">
              <td
                v-for="(cell, j) in row"
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
import { ref } from "vue";
import Banner from "../partials/AppBanner.vue";
import Breadcrumb from "../partials/AppBreadcrumb.vue";

const csvRows = ref<string[][]>([]);

function handleCsvUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    csvRows.value = text
      .trim()
      .split("\n")
      .map((line) => line.split(",").map((cell) => cell.trim()));
  };
  reader.readAsText(file);
}
</script>
