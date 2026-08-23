<template>
  <div class="controls">
    <button @click="logSelected">Показать выбранную строку</button>
  </div>

  <AgGridVue
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :context="context"
    rowSelection="single"
    :animateRows="true"
    @grid-ready="onGridReady"
    @cell-value-changed="onCellValueChanged"
    @selection-changed="onSelectionChanged"
  />
</template>

<script setup lang="ts">
import { ref, shallowRef, markRaw, inject } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridApi, GridReadyEvent, CellValueChangedEvent, SelectionChangedEvent } from 'ag-grid-community'
import StatusBadge from '@/components/StatusBadge.vue'
import ActionCell from '@/components/ActionCell.vue'

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
])

const context = {
  parent: {
    onRowAction: (row: Employee) => emit('log', `Открыт сотрудник: ${row.firstName} ${row.lastName}`)
  }
}

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'firstName', headerName: 'Имя', editable: true },
  { field: 'lastName', headerName: 'Фамилия', editable: true },
  { field: 'age', headerName: 'Возраст', editable: true, cellEditor: 'agNumberCellEditor' },
  {
    field: 'status',
    headerName: 'Статус',
    cellRenderer: markRaw(StatusBadge),
    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: ['active', 'fired'] }
  },
  {
    headerName: 'Действия',
    cellRenderer: markRaw(ActionCell),
    pinned: 'right',
    suppressSizeToFit: true,
    width: 100,
    minWidth: 100,
    maxWidth: 100
  }
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

function onCellValueChanged(event: CellValueChangedEvent) {
  const colId = event.column.getColId()
  emit('log', `Изменено поле "${colId}": "${event.oldValue}" → "${event.newValue}"`)
}

function onSelectionChanged(event: SelectionChangedEvent) {
  const count = event.api.getSelectedRows().length
  emit('log', `Выделение изменено: выбрано ${count} строк(а)`)
}

function logSelected() {
  const selected = gridApi?.getSelectedRows() ?? []
  if (selected.length === 0) {
    emit('log', 'Ни одна строка не выбрана')
  } else {
    const names = selected.map((row: Employee) => `${row.firstName} ${row.lastName}`).join(', ')
    emit('log', `Выбраны строки: ${names}`)
  }
}
</script>

<style scoped>
.controls {
  display: flex;
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

:deep(.ag-pinned-right-header) {
  border-left: none !important;
}
:deep(.ag-pinned-right-cols-container) {
  border-left: none !important;
}
</style>
