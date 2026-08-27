<template>
  <AgGridVue
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :pivotMode="true"
    :animateRows="true"
    :groupDisplayType="'multipleColumns'"
    @grid-ready="onGridReady"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef } from 'vue'
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'

/**
 * Enterprise: Pivot
 * Сводная таблица: строки - регионы, столбцы - годы, значения - сумма выручки.
 */

// const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => void>('onGridReady')

interface Sale {
  id: number
  region: string
  year: number
  revenue: number
}

const rowData = ref<Sale[]>([
  { id: 1, region: 'North', year: 2022, revenue: 120000 },
  { id: 2, region: 'South', year: 2022, revenue: 95000 },
  { id: 3, region: 'North', year: 2023, revenue: 145000 },
  { id: 4, region: 'West', year: 2022, revenue: 81000 },
  { id: 5, region: 'South', year: 2023, revenue: 102000 },
  { id: 6, region: 'West', year: 2023, revenue: 99000 }
])

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'region', headerName: 'Регион', rowGroup: true, hide: true },
  { field: 'year', headerName: 'Год', pivot: true, hide: true },
  {
    field: 'revenue',
    headerName: 'Выручка',
    aggFunc: 'sum',
    valueFormatter: p => `${p.value?.toLocaleString('ru-RU')} ₽`
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
</script>
