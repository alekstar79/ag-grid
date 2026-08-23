<script setup lang="ts">
defineProps<{
  logs: any[]
}>()
</script>

<template>
  <div class="console-output">
    <div v-if="logs.length === 0" class="console-empty">
      <span>▶</span> Консоль пуста
    </div>
    <div v-for="(log, index) in logs" :key="index" class="console-line">
      <span class="console-arrow">▶</span>
      <span class="console-message">{{ log }}</span>
    </div>
  </div>
</template>

<style scoped>
.console-output {
  background: #1e293b;
  color: #e2e8f0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  padding: 12px 16px;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 16px;
  border: 1px solid #334155;
}
.console-empty {
  color: #64748b;
}
.console-line {
  padding: 2px 0;
  display: flex;
  gap: 8px;
}
.console-arrow {
  color: #3b82f6;
  user-select: none;
}
.console-message {
  word-break: break-all;
}
</style>
