<template>
  <AgGridVue
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :animateRows="true"
    @grid-ready="onGridReady"
    @cell-editing-started="onCellEditingStarted"
    @cell-editing-stopped="onCellEditingStopped"
    @cell-value-changed="onCellValueChanged"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef, markRaw } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridApi, GridReadyEvent, CellValueChangedEvent, CellEditingStartedEvent, CellEditingStoppedEvent } from 'ag-grid-community'
import DepartmentEditor from '@/components/DepartmentEditor.vue'

/**
 * Кастомный cell editor — Vue-компонент для редактирования ячейки.
 * Используется для выбора отдела из списка с автодополнением.
 * Реализует методы getValue(), isPopup(), isCancelBeforeStart(), isCancelAfterEnd().
 */

const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => void>('onGridReady')

interface Employee {
  id: number
  firstName: string
  department: string
}

const rowData = ref<Employee[]>([
  { id: 1, firstName: 'Иван', department: 'IT' },
  { id: 2, firstName: 'Мария', department: 'HR' },
  { id: 3, firstName: 'Алексей', department: 'Sales' },
])

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80, editable: false },
  { field: 'firstName', headerName: 'Имя', editable: true },
  {
    field: 'department',
    headerName: 'Отдел',
    editable: true,
    cellEditor: markRaw(DepartmentEditor),
    cellEditorPopup: true
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

function onCellEditingStarted(event: CellEditingStartedEvent) {
  const row = event.data
  const columnId = event.column?.getId()
  emit('log', `Редактирование начато для строки ${row.firstName} (поле: ${columnId})`)
}

function onCellEditingStopped(event: CellEditingStoppedEvent) {
  const row = event.data
  const columnId = event.column?.getId()
  emit('log', `Редактирование завершено для строки ${row.firstName} (поле: ${columnId})`)
}

function onCellValueChanged(event: CellValueChangedEvent) {
  const colId = event.column.getColId()
  if (colId === 'department') {
    emit('log', `Отдел сотрудника ${event.data.firstName} изменён: "${event.oldValue}" → "${event.newValue}"`)
  }
}
</script>
