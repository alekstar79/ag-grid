<template>
  <div class="controls">
    <input type="text" placeholder="Быстрый поиск..." @input="onQuickFilter" />
    <select v-model="statusFilter" @change="applyExternalFilter">
      <option value="all">Все статусы</option>
      <option value="active">Активные</option>
      <option value="fired">Уволенные</option>
    </select>
    <button @click="resetFilters">Сбросить все фильтры</button>
    <button @click="logFilterModel">Показать модель фильтров</button>
  </div>

  <AgGridVue
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :isExternalFilterPresent="isExternalFilterPresent"
    :doesExternalFilterPass="doesExternalFilterPass"
    :animateRows="true"
    @grid-ready="onGridReady"
    @filter-changed="onFilterChanged"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'

const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => void>('onGridReady')

interface Employee {
  id: number
  firstName: string
  lastName: string
  age: number
  salary: number
  status: 'active' | 'fired'
  hired: string
}

const rowData = ref<Employee[]>([
  { id: 1, firstName: 'Иван', lastName: 'Петров', age: 32, salary: 220000, status: 'active', hired: '2021-03-01' },
  { id: 2, firstName: 'Мария', lastName: 'Сидорова', age: 27, salary: 180000, status: 'fired', hired: '2022-07-15' },
  { id: 3, firstName: 'Алексей', lastName: 'Козлов', age: 41, salary: 250000, status: 'active', hired: '2019-11-20' },
  { id: 4, firstName: 'Елена', lastName: 'Иванова', age: 35, salary: 200000, status: 'fired', hired: '2020-05-10' },
])

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'firstName', headerName: 'Имя', filter: 'agTextColumnFilter', filterParams: { debounceMs: 200 } },
  { field: 'lastName', headerName: 'Фамилия', filter: 'agTextColumnFilter' },
  { field: 'age', headerName: 'Возраст', filter: 'agNumberColumnFilter' },
  { field: 'salary', headerName: 'Зарплата', filter: 'agNumberColumnFilter', valueFormatter: p => p.value ? `${p.value.toLocaleString('ru-RU')} ₽` : '' },
  { field: 'status', headerName: 'Статус', filter: 'agTextColumnFilter' },
  { field: 'hired', headerName: 'Дата приема', filter: 'agDateColumnFilter', filterParams: { comparator: (filterDate: Date, cellValue: string) => { if (!cellValue) return 0; const d = new Date(cellValue); return d < filterDate ? -1 : d > filterDate ? 1 : 0 } } },
])

const defaultColDef = shallowRef<ColDef>({
  sortable: true,
  resizable: true,
  filter: true,
  floatingFilter: true,
})

let gridApi: GridApi | null = null
const statusFilter = ref<'all' | 'active' | 'fired'>('all')

function onGridReady(params: GridReadyEvent) {
  gridApi = params.api
  params.api.sizeColumnsToFit()

  if (onGridReadyHandler) {
    onGridReadyHandler()
  }
}

let qTimeout: ReturnType<typeof setTimeout>
function onQuickFilter(e: Event) {
  const val = (e.target as HTMLInputElement).value
  clearTimeout(qTimeout)
  qTimeout = setTimeout(() => {
    gridApi?.setGridOption('quickFilterText', val)
    emit('log', `Quick filter: "${val}"`)
  }, 300)
}

function isExternalFilterPresent() {
  return statusFilter.value !== 'all'
}
function doesExternalFilterPass(node: any) {
  return statusFilter.value === 'all' || node.data?.status === statusFilter.value
}
function applyExternalFilter() {
  gridApi?.onFilterChanged();
  emit('log', `External filter: ${statusFilter.value}`)
}

function resetFilters() {
  gridApi?.setFilterModel(null)
  gridApi?.setGridOption('quickFilterText', '')
  statusFilter.value = 'all'
  const input = document.querySelector('.controls input') as HTMLInputElement
  if (input) input.value = ''
  gridApi?.onFilterChanged()
  emit('log', 'Все фильтры сброшены')
}

function logFilterModel() {
  const model = gridApi?.getFilterModel()
  emit('log', `Модель фильтров: ${JSON.stringify(model, null, 2)}`)
}
function onFilterChanged() {
  emit('log', 'Фильтры изменены (событие)')
}
</script>

<style scoped>
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
}
.controls input,
.controls select {
  padding: 6px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
}
.controls button {
  padding: 6px 14px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  cursor: pointer;
}
.controls button:hover {
  background: #e2e8f0;
}
</style>
