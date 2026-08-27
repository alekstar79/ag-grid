<template>
  <div class="controls">
    <button @click="goToPage(1)">Первая</button>
    <button @click="goToPage(currentPage - 1)">Предыдущая</button>
    <button @click="goToPage(currentPage + 1)">Следующая</button>
    <button @click="goToPage(totalPages)">Последняя</button>
  </div>

  <AgGridVue
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :pagination="true"
    :paginationPageSize="10"
    :paginationPageSizeSelector="[5, 10, 20]"
    :animateRows="true"
    @grid-ready="onGridReady"
    @first-data-rendered="onFirstDataRendered"
    @pagination-changed="onPaginationChanged"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef } from 'vue'
import type { ColDef, GridApi, GridReadyEvent, FirstDataRenderedEvent, PaginationChangedEvent } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'

const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => void>('onGridReady')

const STORAGE_KEY = 'ag-grid-demo-current-page'

const rowData = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Сотрудник ${i + 1}`,
    age: 20 + (i % 30),
    salary: 50000 + (i * 1000),
  }))
)

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Имя' },
  { field: 'age', headerName: 'Возраст', filter: 'agNumberColumnFilter' },
  {
    field: 'salary',
    headerName: 'Зарплата',
    valueFormatter: p => p.value ? `${p.value.toLocaleString('ru-RU')} ₽` : '',
  },
])

const defaultColDef = shallowRef<ColDef>({
  sortable: true,
  resizable: true,
  filter: true,
})

let gridApi: GridApi | null = null
let currentPage = 1
let totalPages = 1
let isFirstPaginationEvent = true // флаг для первого события после монтирования

function onGridReady(params: GridReadyEvent) {
  gridApi = params.api
  params.api.sizeColumnsToFit()

  if (onGridReadyHandler) {
    onGridReadyHandler()
  }

  isFirstPaginationEvent = true
}

function onFirstDataRendered(event: FirstDataRenderedEvent) {
  const savedPage = Number(localStorage.getItem(STORAGE_KEY))
  if (savedPage > 1) {
    event.api.paginationGoToPage(savedPage - 1)
  }
}

function onPaginationChanged(event: PaginationChangedEvent) {
  const api = event.api
  currentPage = api.paginationGetCurrentPage() + 1
  totalPages = api.paginationGetTotalPages()

  // Пропускаем первое событие (при инициализации или восстановлении страницы)
  if (isFirstPaginationEvent) {
    isFirstPaginationEvent = false
    return
  }

  // Логируем только когда страница реально изменилась (клик по встроенным или внешним кнопкам)
  if (event.newPage) {
    localStorage.setItem(STORAGE_KEY, String(currentPage))
    emit('log', `Страница ${currentPage} из ${totalPages}`)
  }
}

function goToPage(page: number) {
  if (!gridApi) return
  if (page < 1 || page > totalPages) return
  gridApi.paginationGoToPage(page - 1)
  emit('log', `Переход на страницу ${page}`)
}
</script>

<style scoped>
.controls {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
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
