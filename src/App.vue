<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from './components/DashboardLayout.vue'
import EmptyLayout from './components/EmptyLayout.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  return route.meta.layout === 'empty' ? EmptyLayout : DashboardLayout
})
</script>
