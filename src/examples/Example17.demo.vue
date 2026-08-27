<template>
  <div class="controls">
    <button @click="copySelection">Копировать выделенное</button>
  </div>

  <AgGridVue
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :enableRangeSelection="true"
    :animateRows="true"
    @grid-ready="onGridReady"
    @range-selection-changed="onRangeSelectionChanged"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef } from 'vue'
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'

/**
 * Enterprise: Range Selection
 * Выделение прямоугольной области ячеек мышью.
 * Логируется изменение выделения. Кнопка копирует диапазон в буфер обмена.
 * Для v31.3.4 используется enableRangeSelection: true.
 */

const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => void>('onGridReady')

const rowData = ref(
  Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Сотрудник ${i + 1}`,
    age: 20 + (i % 30),
    salary: 50000 + (i * 1000)
  }))
)

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Имя' },
  { field: 'age', headerName: 'Возраст', filter: 'agNumberColumnFilter' },
  {
    field: 'salary',
    headerName: 'Зарплата',
    valueFormatter: p => p.value ? `${p.value.toLocaleString('ru-RU')} ₽` : ''
  }
])

const defaultColDef = shallowRef<ColDef>({
  sortable: true,
  resizable: true,
  filter: true,
  flex: 1
})

let gridApi: GridApi | null = null

function onGridReady(params: GridReadyEvent) {
  gridApi = params.api
  params.api.sizeColumnsToFit()

  if (onGridReadyHandler) {
    onGridReadyHandler()
  }
}

// Событие для v31.3.4: range-selection-changed
function onRangeSelectionChanged() {
  const ranges = gridApi?.getCellRanges() ?? []

  if (ranges.length > 0) {
    emit('log', `Выделен диапазон ячеек (${ranges.length} диапазонов)`)
  }
}

function copySelection() {
  if (!gridApi) return

  gridApi.copySelectedRangeToClipboard()
  emit('log', 'Диапазон скопирован в буфер обмена')
}
</script>

<style scoped>
.controls {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
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
