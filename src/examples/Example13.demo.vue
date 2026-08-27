<template>
  <div class="instructions">
    <p>Используйте клавиши <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> для навигации, <kbd>Enter</kbd> для редактирования, <kbd>Tab</kbd> для перехода между ячейками.</p>
  </div>

  <AgGridVue
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :animateRows="true"
    @grid-ready="onGridReady"
    @cell-key-down="onCellKeyDown"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef } from 'vue'
import type { ColDef, GridApi, GridReadyEvent, CellKeyDownEvent } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'

const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => void>('onGridReady')

const rowData = ref([
  { id: 1, firstName: 'Иван', lastName: 'Петров', age: 32 },
  { id: 2, firstName: 'Мария', lastName: 'Сидорова', age: 27 },
  { id: 3, firstName: 'Алексей', lastName: 'Козлов', age: 41 }
])

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'firstName', headerName: 'Имя', editable: true },
  { field: 'lastName', headerName: 'Фамилия', editable: true },
  { field: 'age', headerName: 'Возраст', editable: true }
])

const defaultColDef = shallowRef<ColDef>({
  sortable: true,
  resizable: true,
  filter: true,
  editable: true
})

let gridApi: GridApi | null = null

function onGridReady(params: GridReadyEvent) {
  gridApi = params.api
  params.api.sizeColumnsToFit()

  if (onGridReadyHandler) {
    onGridReadyHandler()
  }
}

function onCellKeyDown(event: CellKeyDownEvent) {
  const key = (event.event as KeyboardEvent).key
  const colId = event.column.getColId()
  const rowIndex = event.rowIndex

  if (key === 'Enter') {
    emit('log', `Редактирование ячейки (${colId}, строка ${rowIndex})`)
  } else if (key.startsWith('Arrow')) {
    emit('log', `Навигация клавишей ${key}`)
  } else if (key === 'Tab') {
    emit('log', 'Переход Tab')
  }
}
</script>

<style scoped>
.instructions {
  margin-bottom: 12px;
  color: #475569;
  font-size: 14px;
}
.instructions kbd {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
}
</style>
