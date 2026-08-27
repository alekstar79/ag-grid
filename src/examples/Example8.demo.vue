<template>
  <div class="controls">
    <button @click="addRow">➕ Добавить</button>
    <button @click="updateSelected">✏️ Обновить выбранного</button>
    <button @click="removeSelected">🗑️ Удалить выбранных</button>
    <button @click="showInfo">📊 Показать информацию</button>
  </div>

  <AgGridVue
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :getRowId="getRowId"
    rowSelection="multiple"
    :animateRows="true"
    @grid-ready="onGridReady"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef } from 'vue'
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'

/**
 * Назначение: показывает, как использовать applyTransaction для точечного добавления,
 * удаления и обновления строк без полной перерисовки всей таблицы. Это критически важно
 * для производительности при работе с большими объёмами данных (сотни тысяч строк),
 * так как перерисовка всей таблицы при каждом изменении вызывает лаги. Транзакции обновляют
 * только изменённые строки.
 */

const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => void>('onGridReady')

interface Employee {
  id: number
  firstName: string
  salary: number
}

const rowData = ref<Employee[]>([
  { id: 1, firstName: 'Иван', salary: 100000 },
  { id: 2, firstName: 'Мария', salary: 150000 },
  { id: 3, firstName: 'Алексей', salary: 200000 },
])

let nextId = 4

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'firstName', headerName: 'Имя' },
  {
    field: 'salary',
    headerName: 'Зарплата',
    valueFormatter: p => p.value ? `${p.value.toLocaleString('ru-RU')} ₽` : ''
  }
])

const defaultColDef = shallowRef<ColDef>({ sortable: true, resizable: true, filter: true })

function getRowId(params: any) {
  return String(params.data.id)
}

let gridApi: GridApi | null = null

function onGridReady(params: GridReadyEvent) {
  gridApi = params.api
  params.api.sizeColumnsToFit()

  if (onGridReadyHandler) {
    onGridReadyHandler()
  }
}

function addRow() {
  if (!gridApi) return

  const newRow: Employee = {
    id: nextId++,
    firstName: `Новый ${nextId - 1}`,
    salary: Math.round(Math.random() * 100000 + 50000)
  }

  rowData.value = [...rowData.value, newRow]
  gridApi.applyTransaction({ add: [newRow] })
  emit('log', `Добавлена строка #${newRow.id}: ${newRow.firstName}, зарплата ${newRow.salary}`)
}

function updateSelected() {
  if (!gridApi) return

  const selected = gridApi.getSelectedRows() as Employee[]
  if (!selected.length) {
    emit('log', 'Нет выбранных строк для обновления')
    return
  }

  const updated = selected.map(row => {
    // Добавляем "(ред)" только если его ещё нет
    let newName = row.firstName
    if (!newName.includes('(ред)')) {
      newName = `${newName} (ред)`
    }
    // Меняем зарплату случайным образом
    const newSalary = Math.round(row.salary * (0.8 + Math.random() * 0.4))
    return { ...row, firstName: newName, salary: newSalary }
  })

  // Обновляем rowData
  const ids = new Set(updated.map(r => r.id))
  rowData.value = rowData.value.map(r => ids.has(r.id) ? updated.find(u => u.id === r.id)! : r)
  gridApi.applyTransaction({ update: updated })
  emit('log', `Обновлено ${updated.length} строк(и)`)
}

function removeSelected() {
  if (!gridApi) return

  const selected = gridApi.getSelectedRows() as Employee[]
  if (!selected.length) {
    emit('log', 'Нет выбранных строк для удаления')
    return
  }

  const idsToRemove = new Set(selected.map(r => r.id))
  rowData.value = rowData.value.filter(r => !idsToRemove.has(r.id))
  gridApi.applyTransaction({ remove: selected })
  emit('log', `Удалено ${selected.length} строк(и)`)
}

function showInfo() {
  if (!gridApi) return

  const totalRows = gridApi.getDisplayedRowCount()
  const selectedRows = gridApi.getSelectedRows().length
  const totalSalary = rowData.value.reduce((sum, r) => sum + r.salary, 0)
  const avgSalary = totalRows ? Math.round(totalSalary / totalRows) : 0
  emit('log', `📊 Всего строк: ${totalRows}, выбрано: ${selectedRows}`)
  emit('log', `💰 Сумма зарплат: ${totalSalary.toLocaleString('ru-RU')} ₽, средняя: ${avgSalary.toLocaleString('ru-RU')} ₽`)
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
