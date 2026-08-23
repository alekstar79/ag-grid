<template>
  <div class="controls">
    <button @click="sortSalaryDesc">Сортировать по зарплате ↓</button>
    <button @click="sortSalaryAsc">Сортировать по зарплате ↑</button>
    <button @click="resetSorting">Сбросить сортировку</button>
    <button @click="logSortState">Показать текущую сортировку</button>
  </div>

  <AgGridVue
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :animateRows="true"
    @grid-ready="onGridReady"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'

const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => void>('onGridReady')

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  salary: number;
  status: 'active' | 'fired';
  hired: string
}

const rowData = ref<Employee[]>([
  { id: 1, firstName: 'Иван', lastName: 'Петров', age: 32, salary: 220000, status: 'active', hired: '2021-03-01' },
  { id: 2, firstName: 'Мария', lastName: 'Сидорова', age: 27, salary: 180000, status: 'fired', hired: '2022-07-15' },
  { id: 3, firstName: 'Алексей', lastName: 'Козлов', age: 41, salary: 250000, status: 'active', hired: '2019-11-20' },
  { id: 4, firstName: 'Елена', lastName: 'Иванова', age: 35, salary: 200000, status: 'active', hired: '2020-05-10' },
])

const ruComparator = (a: string, b: string) => (a ?? '').localeCompare(b ?? '', 'ru', { sensitivity: 'base' })
const numComparator = (a?: number, b?: number) => ((a == null ? Infinity : a) - (b == null ? Infinity : b))

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'firstName', headerName: 'Имя', comparator: ruComparator },
  { field: 'lastName', headerName: 'Фамилия', comparator: ruComparator },
  { field: 'age', headerName: 'Возраст', comparator: numComparator },
  { field: 'salary', headerName: 'Зарплата', comparator: numComparator, valueFormatter: p => p.value ? `${p.value.toLocaleString('ru-RU')} ₽` : '' },
  { field: 'status', headerName: 'Статус' },
  { field: 'hired', headerName: 'Дата приема' },
])

const defaultColDef = shallowRef<ColDef>({ sortable: true, resizable: true, filter: true })

let gridApi: GridApi | null = null

function onGridReady(params: GridReadyEvent) {
  gridApi = params.api
  params.api.sizeColumnsToFit()

  if (onGridReadyHandler) {
    onGridReadyHandler()
  }
}

function sortSalaryDesc() {
  gridApi?.applyColumnState({ state: [{ colId: 'salary', sort: 'desc' }], defaultState: { sort: null } })
  emit('log', 'Сортировка по зарплате ↓')
}
function sortSalaryAsc() {
  gridApi?.applyColumnState({ state: [{ colId: 'salary', sort: 'asc' }], defaultState: { sort: null } })
  emit('log', 'Сортировка по зарплате ↑')
}
function resetSorting() {
  gridApi?.applyColumnState({ defaultState: { sort: null } })
  emit('log', 'Сортировка сброшена')
}
function logSortState() {
  const state = gridApi?.getColumnState() ?? []
  const sorting = state.filter(col => col.sort)
  emit('log', sorting.length ? `Текущая сортировка: ${sorting.map(c => `${c.colId}: ${c.sort}`).join(', ')}` : 'Сортировка не активна')
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
}
.controls button:hover {
  background: #e2e8f0;
}
</style>
