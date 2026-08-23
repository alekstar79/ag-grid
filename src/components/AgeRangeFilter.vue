<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ params: any }>()

const minAge = ref<number | null>(null)
const maxAge = ref<number | null>(null)

function onInput() {
  props.params.filterChangedCallback()
}

function isFilterActive() {
  return minAge.value != null || maxAge.value != null
}

function doesFilterPass(params: any) {
  const age = params.data?.age

  if (typeof age !== 'number') return false
  if (minAge.value != null && age < minAge.value) return false

  return !(maxAge.value != null && age > maxAge.value)

}

function getModel() {
  if (!isFilterActive()) return undefined

  return {
    minAge: minAge.value,
    maxAge: maxAge.value
  }
}

function setModel(model: any) {
  minAge.value = model?.minAge ?? null
  maxAge.value = model?.maxAge ?? null
}

function afterGuiAttached() {
  const firstInput = document.querySelector('.my-age-filter-min') as HTMLInputElement
  firstInput?.focus()
}

function clear() {
  minAge.value = null
  maxAge.value = null
  props.params.filterChangedCallback()
}

defineExpose({ isFilterActive, doesFilterPass, getModel, setModel, afterGuiAttached })
</script>

<template>
  <div class="my-age-filter">
    <div class="my-age-filter__title">Возраст от/до</div>

    <div class="my-age-filter__row">
      <div class="my-age-filter__field">
        <label>От</label>
        <input
          type="number"
          class="my-age-filter-min my-age-filter__input"
          v-model.number="minAge"
          @input="onInput"
          placeholder="Мин"
        />
      </div>

      <div class="my-age-filter__field">
        <label>До</label>
        <input
          type="number"
          class="my-age-filter-max my-age-filter__input"
          v-model.number="maxAge"
          @input="onInput"
          placeholder="Макс"
        />
      </div>
    </div>

    <button class="my-age-filter__reset" @click="clear">Сбросить</button>
  </div>
</template>

<style>
.my-age-filter {
  background-color: #ffffff !important;
  border: 1px solid #d1d5db !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  padding: 12px !important;
  min-width: 220px !important;
  font-family: inherit !important;
  box-sizing: border-box !important;
}

.my-age-filter__title {
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #374151 !important;
  margin-bottom: 10px !important;
}

.my-age-filter__row {
  display: flex !important;
  gap: 10px !important;
  margin-bottom: 12px !important;
}

.my-age-filter__field {
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
}

.my-age-filter__field label {
  font-size: 12px !important;
  color: #6b7280 !important;
  margin-bottom: 4px !important;
  font-weight: 500 !important;
}

.my-age-filter__input {
  width: 100% !important;
  padding: 6px 8px !important;
  border: 1px solid #d1d5db !important;
  border-radius: 4px !important;
  font-size: 13px !important;
  box-sizing: border-box !important;
  outline: none !important;
  background-color: #ffffff !important;
  color: #111827 !important;
}

.my-age-filter__input:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}

.my-age-filter__reset {
  width: 100% !important;
  padding: 6px 0 !important;
  background: #f9fafb !important;
  border: 1px solid #d1d5db !important;
  border-radius: 4px !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  color: #374151 !important;
  cursor: pointer !important;
  transition: background 0.15s, border-color 0.15s !important;
  font-family: inherit !important;
}

.my-age-filter__reset:hover {
  background: #f3f4f6 !important;
  border-color: #9ca3af !important;
}
</style>
