<template>
  <div class="controls">
    <button @click="addEmployee">➕ Добавить</button>
    <button @click="deleteSelected">🗑️ Удалить выбранных</button>
    <button @click="saveState">💾 Сохранить состояние</button>
    <button @click="restoreState">📂 Восстановить состояние</button>
    <button @click="resetState">🔄 Сбросить состояние</button>
  </div>

  <AgGridVue
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    rowSelection="multiple"
    :getRowId="getRowId"
    :animateRows="true"
    @grid-ready="onGridReady"
    @cell-value-changed="onCellValueChanged"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridApi, GridReadyEvent, CellValueChangedEvent } from 'ag-grid-community'

const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => void>('onGridReady')

interface Employee {
  id: number
  firstName: string
  lastName: string
  salary: number
}

const initialData: Employee[] = [
  { id: 1, firstName: 'Иван', lastName: 'Петров', salary: 220000 },
  { id: 2, firstName: 'Мария', lastName: 'Сидорова', salary: 180000 },
  { id: 3, firstName: 'Алексей', lastName: 'Козлов', salary: 250000 },
]

const rowData = ref<Employee[]>([...initialData])
let nextId = 4
const STORAGE_KEY = 'ag-grid-demo-state'

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80, editable: false },
  { field: 'firstName', headerName: 'Имя', editable: true },
  { field: 'lastName', headerName: 'Фамилия', editable: true },
  {
    field: 'salary',
    headerName: 'Зарплата',
    editable: true,
    cellEditor: 'agNumberCellEditor',
    valueFormatter: p => p.value ? `${p.value.toLocaleString('ru-RU')} ₽` : ''
  }
])

const defaultColDef = shallowRef<ColDef>({ sortable: true, resizable: true, filter: true })

let gridApi: GridApi | null = null

function getRowId(params: any) {
  return String(params.data.id)
}

function onGridReady(params: GridReadyEvent) {
  gridApi = params.api
  params.api.sizeColumnsToFit()

  if (onGridReadyHandler) {
    onGridReadyHandler()
  }
}

function onCellValueChanged(event: CellValueChangedEvent) {
  const colId = event.column.getColId()
  const rowId = event.data.id
  const rowIndex = rowData.value.findIndex(r => r.id === rowId)

  if (rowIndex !== -1) {
    const oldRow = rowData.value[rowIndex]
    const newRow = { ...oldRow, [colId]: event.newValue }
    rowData.value = [
      ...rowData.value.slice(0, rowIndex),
      newRow,
      ...rowData.value.slice(rowIndex + 1)
    ]
    gridApi?.applyTransaction({ update: [newRow] })
  }

  emit('log', `Изменено поле "${colId}": "${event.oldValue}" → "${event.newValue}"`)
}

function addEmployee() {
  if (!gridApi) return

  const newEmployee: Employee = {
    id: nextId++,
    firstName: 'Новый',
    lastName: `Сотрудник ${nextId - 1}`,
    salary: Math.round(Math.random() * 100000 + 50000)
  }

  rowData.value = [...rowData.value, newEmployee]
  gridApi.applyTransaction({ add: [newEmployee] })

  emit('log', `Добавлен сотрудник: ${newEmployee.firstName} ${newEmployee.lastName}`)
}

function deleteSelected() {
  if (!gridApi) return

  const selected = gridApi.getSelectedRows() as Employee[]
  if (!selected.length) {
    emit('log', 'Нет выбранных строк для удаления')
    return
  }

  // Удаляем из rowData
  const idsToRemove = new Set(selected.map(r => r.id))

  rowData.value = rowData.value.filter(r => !idsToRemove.has(r.id))
  gridApi.applyTransaction({ remove: selected })

  emit('log', `Удалено ${selected.length} сотрудников`)
}

function saveState() {
  if (!gridApi) return

  const state = {
    data: rowData.value,
    columns: gridApi.getColumnState(),
    filters: gridApi.getFilterModel()
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))

  emit('log', 'Состояние (данные + колонки + фильтры) сохранено')
}

function restoreState() {
  if (!gridApi) return

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    emit('log', 'Сохранённое состояние не найдено')
    return
  }

  try {
    const state = JSON.parse(raw)
    if (state.data && Array.isArray(state.data)) {
      rowData.value = state.data
      // Обновляем nextId на основе максимального ID
      const maxId = rowData.value.reduce((max, r) => Math.max(max, r.id), 0)
      nextId = maxId + 1
      // Применяем транзакцию для синхронизации AG Grid (перезагружаем все данные)
      gridApi.setGridOption('rowData', rowData.value)
    }
    if (state.columns) {
      gridApi.applyColumnState({ state: state.columns, applyOrder: true })
    }
    if (state.filters) {
      gridApi.setFilterModel(state.filters)
    }
    emit('log', 'Состояние успешно восстановлено')
  } catch (e) {
    emit('log', 'Ошибка при восстановлении состояния')
  }
}

function resetState() {
  if (!gridApi) return

  rowData.value = [...initialData]
  nextId = initialData.reduce((max, r) => Math.max(max, r.id), 0) + 1

  gridApi.setGridOption('rowData', rowData.value)
  gridApi.applyColumnState({ defaultState: { sort: null } })
  gridApi.setFilterModel(null)

  localStorage.removeItem(STORAGE_KEY)
  emit('log', 'Состояние сброшено к начальному')
}
</script>

<style scoped>
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
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
