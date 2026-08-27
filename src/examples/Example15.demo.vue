<template>
  <AgGridVue
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :autoGroupColumnDef="autoGroupColumnDef"
    :groupDisplayType="'multipleColumns'"
    :animateRows="true"
    @grid-ready="onGridReady"
    @row-group-opened="onRowGroupOpened"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef } from 'vue'
import type { ColDef, GridApi, GridReadyEvent, RowGroupOpenedEvent } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'

/**
 * Enterprise: Row Grouping & Aggregation
 * Группировка по региону, агрегация сумм продаж.
 * Демонстрирует autoGroupColumnDef, rowGroup, aggFunc.
 * Логируется раскрытие/сворачивание групп.
 */

const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => void>('onGridReady')

interface Sale {
  id: number
  region: string
  year: number
  revenue: number
}

const rowData = ref<Sale[]>([
  { id: 1, region: 'Север', year: 2022, revenue: 120000 },
  { id: 2, region: 'Юг', year: 2022, revenue: 95000 },
  { id: 3, region: 'Север', year: 2023, revenue: 145000 },
  { id: 4, region: 'Запад', year: 2022, revenue: 81000 },
  { id: 5, region: 'Юг', year: 2023, revenue: 102000 },
  { id: 6, region: 'Запад', year: 2023, revenue: 99000 }
])

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'region', headerName: 'Регион', rowGroup: true, hide: true },
  { field: 'year', headerName: 'Год', width: 100 },
  {
    field: 'revenue',
    headerName: 'Выручка',
    aggFunc: 'sum',
    valueFormatter: p => p.value ? `${p.value.toLocaleString('ru-RU')} ₽` : ''
  }
])

const defaultColDef = shallowRef<ColDef>({
  sortable: true,
  resizable: true,
  filter: true,
  flex: 1
})

const autoGroupColumnDef = shallowRef<ColDef>({
  headerName: 'Группа',
  minWidth: 200
})

let gridApi: GridApi | null = null

function onGridReady(params: GridReadyEvent) {
  gridApi = params.api
  params.api.sizeColumnsToFit()

  if (onGridReadyHandler) {
    onGridReadyHandler()
  }
}

function onRowGroupOpened(event: RowGroupOpenedEvent) {
  const { node } = event
  emit('log', `Группа ${node.key} ${node.expanded ? 'раскрыта' : 'свёрнута'}`)
}
</script>
