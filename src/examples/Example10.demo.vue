<template>
  <div class="controls">
    <button @click="applyPreset(25, 35)">Возраст 25–35</button>
    <button @click="applyPreset(40, 100)">Возраст 40+</button>
    <button @click="resetFilter">Сбросить фильтр</button>
  </div>

  <AgGridVue
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :animateRows="true"
    @grid-ready="onGridReady"
    @filter-changed="onFilterChanged"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef, markRaw } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridApi, GridReadyEvent, FilterChangedEvent } from 'ag-grid-community'
import AgeRangeFilter from '@/components/AgeRangeFilter.vue'

/**
 * Кастомный фильтр — Vue-компонент, реализующий интерфейс IFilter.
 * Здесь мы также используем программное управление фильтром:
 * кнопки пресетов устанавливают модель фильтра через gridApi.
 * Все действия логируются для понимания работы.
 */

const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => void>('onGridReady')

interface Employee {
  id: number
  firstName: string
  lastName: string
  age: number
  salary: number
}

const rowData = ref<Employee[]>([
  { id: 1, firstName: 'Иван', lastName: 'Петров', age: 32, salary: 220000 },
  { id: 2, firstName: 'Мария', lastName: 'Сидорова', age: 27, salary: 180000 },
  { id: 3, firstName: 'Алексей', lastName: 'Козлов', age: 41, salary: 250000 },
  { id: 4, firstName: 'Елена', lastName: 'Иванова', age: 35, salary: 200000 },
  { id: 5, firstName: 'Дмитрий', lastName: 'Смирнов', age: 24, salary: 150000 }
])

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'firstName', headerName: 'Имя' },
  { field: 'lastName', headerName: 'Фамилия' },
  {
    field: 'age',
    headerName: 'Возраст',
    filter: markRaw(AgeRangeFilter),
    floatingFilter: true,
  },
  {
    field: 'salary',
    headerName: 'Зарплата',
    valueFormatter: p => p.value ? `${p.value.toLocaleString('ru-RU')} ₽` : ''
  }
])

const defaultColDef = shallowRef<ColDef>({
  sortable: true,
  resizable: true,
  filter: true
})

let gridApi: GridApi | null = null

function onGridReady(params: GridReadyEvent) {
  gridApi = params.api
  params.api.sizeColumnsToFit()

  if (onGridReadyHandler) {
    onGridReadyHandler()
  }
}

function applyPreset(min: number, max: number) {
  if (!gridApi) return

  gridApi.setFilterModel({
    age: { minAge: min, maxAge: max }
  })

  emit('log', `Применён пресет: возраст от ${min} до ${max}`)
}

function resetFilter() {
  if (!gridApi) return

  gridApi.setFilterModel(null)

  emit('log', 'Кастомный фильтр сброшен')
}

function onFilterChanged(event: FilterChangedEvent) {
  const model = event.api.getFilterModel()
  emit('log', 'Событие filterChanged. Текущая модель фильтров: ' + JSON.stringify(model))
}
</script>

<style scoped>
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  flex-shrink: 0;
}
.controls button {
  padding: 6px 14px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.controls button:hover {
  background: #e2e8f0;
}
</style>
