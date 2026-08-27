<template>
  <div class="controls">
    <button @click="addEmployee">➕ Добавить сотрудника</button>
    <span style="margin-left: 12px; font-size: 0.9rem; color: #475569;">
      💡 Редактируйте имя или зарплату – итог пересчитается автоматически
    </span>
  </div>

  <AgGridVue
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :pinnedBottomRowData="pinnedBottomRowData"
    :animateRows="true"
    @grid-ready="onGridReady"
    @cell-value-changed="onCellValueChanged"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef, computed } from 'vue'
import type { ColDef, GridApi, GridReadyEvent, CellValueChangedEvent } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'

const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => void>('onGridReady')

interface Employee {
  id: number
  firstName: string
  salary: number
}

// Начальные данные
const initialData: Employee[] = [
  { id: 1, firstName: 'Иван', salary: 100000 },
  { id: 2, firstName: 'Мария', salary: 150000 },
  { id: 3, firstName: 'Алексей', salary: 200000 },
]

// Реактивные данные и счётчик ID
const rowData = ref<Employee[]>([...initialData])
let nextId = 4 // следующий доступный ID

// Итоговая строка (вычисляется автоматически)
const pinnedBottomRowData = computed(() => {
  const total = rowData.value.reduce((sum, r) => sum + r.salary, 0)
  return [{ id: 'total', firstName: 'ИТОГО', salary: total }]
})

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80, editable: false },
  { field: 'firstName', headerName: 'Имя', editable: true },
  {
    field: 'salary',
    headerName: 'Зарплата',
    editable: true,
    cellEditor: 'agNumberCellEditor',
    valueFormatter: p => p.value ? `${p.value.toLocaleString('ru-RU')} ₽` : ''
  }
])

const defaultColDef = shallowRef<ColDef>({
  sortable: true,
  resizable: true,
  filter: true,
})

let gridApi: GridApi | null = null

function onGridReady(params: GridReadyEvent) {
  gridApi = params.api
  params.api.sizeColumnsToFit()

  if (onGridReadyHandler) {
    onGridReadyHandler()
  }
}

// Обработчик изменения ячейки – обновляем данные в rowData, чтобы пересчитать итог
function onCellValueChanged(event: CellValueChangedEvent) {
  const colId = event.column.getColId()
  const rowId = event.data.id
  // Находим обновляемую строку в rowData и меняем значение
  const rowIndex = rowData.value.findIndex(r => r.id === rowId)
  if (rowIndex !== -1) {
    const oldRow = rowData.value[rowIndex]
    const newRow = { ...oldRow, [colId]: event.newValue }
    rowData.value = [
      ...rowData.value.slice(0, rowIndex),
      newRow,
      ...rowData.value.slice(rowIndex + 1)
    ]
    // Синхронизируем AG Grid через транзакцию (обновляем только одну строку)
    gridApi?.applyTransaction({ update: [newRow] })
  }
  emit('log', `Изменено поле "${colId}": "${event.oldValue}" → "${event.newValue}"`)
}

// Добавление сотрудника
function addEmployee() {
  if (!gridApi) return
  const newEmployee: Employee = {
    id: nextId++,
    firstName: `Новый ${nextId - 1}`,
    salary: Math.round(Math.random() * 100000 + 50000)
  }
  // Обновляем rowData (добавляем в конец)
  rowData.value = [...rowData.value, newEmployee]
  // Применяем транзакцию для AG Grid
  gridApi.applyTransaction({ add: [newEmployee] })
  emit('log', `Добавлен сотрудник: ${newEmployee.firstName} с зарплатой ${newEmployee.salary}`)
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
