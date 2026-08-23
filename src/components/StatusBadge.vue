<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ params: any }>()
const status = computed(() => props.params.value)
const color = computed(() => status.value === 'active' ? '#16a34a' : '#dc2626')
const label = computed(() => status.value === 'active' ? 'Активен' : 'Уволен')
</script>

<template>
  <span :style="{
    color,
    border: `1px solid ${color}`,
    borderRadius: '999px',
    padding: '0 6px',
    fontSize: '12px',
    lineHeight: '20px',
    display: 'inline-block'
  }">
    {{ label }}
  </span>
</template>
