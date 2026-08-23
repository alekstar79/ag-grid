<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

const isSidebarOpen = ref(true)
</script>

<template>
  <div class="app-layout">
    <Sidebar :is-open="isSidebarOpen" @toggle="isSidebarOpen = !isSidebarOpen" />
    <main class="main-content" :style="{ marginLeft: isSidebarOpen ? '260px' : '72px' }">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: #f8fafc;
  color: #0f172a;
}

.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  padding: 32px 40px;
  flex: 1;
  transition: margin-left 0.3s ease;
}
</style>
