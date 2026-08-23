<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

const props = defineProps<{ params: any }>()

const departments = ['IT', 'HR', 'Sales', 'Marketing', 'Finance']
const value = ref(props.params.value ?? '')
const search = ref('')

const filteredDepartments = computed(() => {
  if (!search.value) return departments
  return departments.filter(d => d.toLowerCase().includes(search.value.toLowerCase()))
})

function onSearch(event: Event) {
  search.value = (event.target as HTMLInputElement).value
}

function onSelect(department: string) {
  value.value = department
  props.params.api.stopEditing()
}

function getValue() {
  return value.value
}

function isPopup() {
  return true
}

function isCancelBeforeStart() {
  return false
}

function isCancelAfterEnd() {
  return value.value === ''
}

onMounted(() => {
  const input = document.querySelector('.my-dept-editor-search') as HTMLInputElement
  input?.focus()
})

defineExpose({
  getValue,
  isPopup,
  isCancelBeforeStart,
  isCancelAfterEnd
})
</script>

<template>
  <div class="my-dept-editor">
    <div class="my-dept-editor__header">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 21l-4.35-4.35"/>
        <circle cx="11" cy="11" r="8"/>
      </svg>
      <span>Выбор отдела</span>
    </div>

    <input
      class="my-dept-editor-search"
      :value="search"
      @input="onSearch"
      placeholder="Поиск..."
    />

    <ul v-if="filteredDepartments.length" class="my-dept-editor__list">
      <li
        v-for="dept in filteredDepartments"
        :key="dept"
        @click="onSelect(dept)"
        :class="{ 'my-dept-editor__item--selected': value === dept }"
      >
        <span class="my-dept-editor__icon">📁</span>
        <span class="my-dept-editor__name">{{ dept }}</span>
        <span v-if="value === dept" class="my-dept-editor__check">✓</span>
      </li>
    </ul>

    <div v-else class="my-dept-editor__empty">Не найдено</div>
  </div>
</template>

<style>
.my-dept-editor {
  background-color: #ffffff !important;
  border: 1px solid #d1d5db !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  padding: 12px !important;
  width: 240px !important;
  font-family: inherit !important;
  box-sizing: border-box !important;
}

.my-dept-editor__header {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #374151 !important;
  margin-bottom: 8px !important;
}

.my-dept-editor-search {
  width: 100% !important;
  padding: 8px 10px !important;
  border: 1px solid #d1d5db !important;
  border-radius: 6px !important;
  font-size: 14px !important;
  margin-bottom: 8px !important;
  box-sizing: border-box !important;
  outline: none !important;
  transition: border-color 0.2s, box-shadow 0.2s !important;
  background-color: #ffffff !important;
  color: #111827 !important;
}

.my-dept-editor-search:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}

.my-dept-editor__list {
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
  max-height: 160px !important;
  overflow-y: auto !important;
}

.my-dept-editor__list li {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 8px 10px !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  font-size: 14px !important;
  color: #374151 !important;
  transition: background 0.15s !important;
}

.my-dept-editor__list li:hover {
  background-color: #f3f4f6 !important;
}

.my-dept-editor__item--selected {
  background-color: #eff6ff !important;
  color: #1d4ed8 !important;
  font-weight: 600 !important;
}

.my-dept-editor__icon {
  font-size: 16px !important;
  line-height: 1 !important;
}

.my-dept-editor__name {
  flex: 1 !important;
}

.my-dept-editor__check {
  color: #3b82f6 !important;
  font-weight: bold !important;
}

.my-dept-editor__empty {
  padding: 8px !important;
  color: #9ca3af !important;
  font-size: 13px !important;
  text-align: center !important;
}
</style>
