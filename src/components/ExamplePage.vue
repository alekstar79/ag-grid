<template>
  <div class="example-page">
    <header class="page-header">
      <h1>{{ title }}</h1>
      <p v-if="description" class="description">{{ description }}</p>
    </header>

    <div class="tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'demo' }"
        @click="activeTab = 'demo'"
      >
        🖥️ Демо
      </button>
      <button
        v-if="code"
        class="tab-btn"
        :class="{ active: activeTab === 'code' }"
        @click="activeTab = 'code'"
      >
        📄 Код
      </button>
    </div>

    <div class="tab-content">
      <div v-if="activeTab === 'demo'" key="demo" class="demo-section">
        <div class="ag-theme-alpine" style="height: 500px; width: 100%;">
          <div style="display: flex; flex-direction: column; height: 100%; width: 100%;">
            <slot />
          </div>
        </div>

        <slot name="console" />
      </div>

      <div v-if="activeTab === 'code' && code" key="code" class="code-section">
        <CodeBlock :code="code" :language="language" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import CodeBlock from './CodeBlock.vue'
import 'ag-grid-enterprise'

defineProps<{
  title: string
  description?: string
  code?: string
  language?: string
}>()

const emit = defineEmits<{
  (e: 'log', message: string): void
}>()

const activeTab = ref<'demo' | 'code'>('demo')

let isFirstReady = true

const onReady = () => {
  const isFirst = isFirstReady

  if (isFirst) {
    emit('log', 'Таблица готова')
    isFirstReady = false
  }

  return isFirst
}

provide('onGridReady', onReady)
</script>

<style scoped>
.example-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 28px;
}
.page-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 8px 0;
}
.page-header .description {
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.5;
  margin: 0;
}

.tabs {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 24px;
}
.tab-btn {
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
  border-radius: 6px 6px 0 0;
}
.tab-btn:hover {
  color: #0f172a;
  background: rgba(59, 130, 246, 0.04);
}
.tab-btn.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background: rgba(59, 130, 246, 0.06);
}

.tab-content {
  position: relative;
}

.demo-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.code-section {
  background: #1e293b;
  border-radius: 12px;
  padding: 20px;
  overflow: auto;
}

/* Анимация переключения табов */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
