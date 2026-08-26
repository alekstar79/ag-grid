<template>
  <div class="controls">
    <button @click="deselectRows">Deselect Rows</button>
  </div>

  <AgGridVue
    style="width: 100%; height: 100%"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :animateRows="true"
    rowSelection="multiple"
    @grid-ready="onGridReady"
    @cell-clicked="cellClicked"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef } from 'vue'
import type { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'

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

const gridApi = ref<GridApi | null>(null)

const rowData = ref<Employee[]>([
  { id: 1, firstName: 'Иван', lastName: 'Петров', age: 32, salary: 220000, status: 'active', hired: '2021-03-01' },
  { id: 2, firstName: 'Мария', lastName: 'Сидорова', age: 27, salary: 180000, status: 'fired', hired: '2022-07-15' },
  { id: 3, firstName: 'Алексей', lastName: 'Козлов', age: 41, salary: 250000, status: 'active', hired: '2019-11-20' },
])

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'firstName', headerName: 'Имя' },
  { field: 'lastName', headerName: 'Фамилия' },
  { field: 'age', headerName: 'Возраст' },
  { field: 'salary', headerName: 'Зарплата' },
  { field: 'status', headerName: 'Статус' },
  { field: 'hired', headerName: 'Дата приема' },
])

function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api
  params.api.sizeColumnsToFit()

  if (onGridReadyHandler) {
    onGridReadyHandler()
  }
}

function cellClicked(e) {
  emit('log', JSON.stringify(e.data, null, 2))
}

function deselectRows() {
  gridApi.value?.deselectAll()
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
