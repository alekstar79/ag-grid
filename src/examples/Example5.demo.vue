<template>
  <div class="controls">
    <button @click="selectAll">Выбрать все</button>
    <button @click="deselectAll">Снять выделение</button>
    <button @click="exportCSV">Экспорт CSV</button>
    <button @click="logSelectedRows">Показать выбранные</button>
  </div>

  <AgGridVue
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    rowSelection="multiple"
    :animateRows="true"
    @grid-ready="onGridReady"
    @selection-changed="onSelectionChanged"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef } from 'vue'
import type { ColDef, GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'

const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => void>('onGridReady')

interface Employee { id: number; firstName: string; lastName: string; status: 'active' | 'fired' }

const rowData = ref<Employee[]>([
  { id: 1, firstName: 'Иван', lastName: 'Петров', status: 'active' },
  { id: 2, firstName: 'Мария', lastName: 'Сидорова', status: 'fired' },
  { id: 3, firstName: 'Алексей', lastName: 'Козлов', status: 'active' },
  { id: 4, firstName: 'Елена', lastName: 'Иванова', status: 'active' },
])

const columnDefs = shallowRef<ColDef[]>([
  {
    headerName: '',
    width: 50,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    suppressSizeToFit: true
  },
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'firstName', headerName: 'Имя' },
  { field: 'lastName', headerName: 'Фамилия' },
  { field: 'status', headerName: 'Статус' },
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

function selectAll() {
  gridApi?.selectAll()
  emit('log', 'Выбраны все строки')
}

function deselectAll() {
  gridApi?.deselectAll()
  emit('log', 'Выделение снято')
}

function logSelectedRows() {
  const selected = gridApi?.getSelectedRows() ?? []
  if (selected.length === 0) {
    emit('log', 'Ни одна строка не выбрана')
  } else {
    const names = selected.map((row: Employee) => `${row.firstName} ${row.lastName}`).join(', ')
    emit('log', `Выбраны строки: ${names}`)
  }
}

function onSelectionChanged(event: SelectionChangedEvent) {
  const count = event.api.getSelectedRows().length
  emit('log', `Выделение изменено: выбрано ${count} строк(а)`)
}

function exportCSV() {
  gridApi?.exportDataAsCsv({
    fileName: 'employees.csv',
    allColumns: true,
    onlySelected: false
  })
  emit('log', 'Экспорт CSV выполнен (все строки)')
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
</style>
