<template>
  <AgGridVue
    style="flex: 1; width: 100%;"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    rowModelType="infinite"
    :datasource="datasource"
    :cacheBlockSize="100"
    :maxBlocksInCache="10"
    :rowBuffer="20"
    @grid-ready="onGridReady"
    @sort-changed="onSortChanged"
    @filter-changed="onFilterChanged"
  />
</template>

<script setup lang="ts">
import {inject, shallowRef} from 'vue'
import {AgGridVue} from 'ag-grid-vue3'
import type {
  ColDef,
  FilterChangedEvent,
  GridApi,
  GridReadyEvent,
  IDatasource,
  SortChangedEvent
} from 'ag-grid-community'

/**
 * Infinite Row Model — данные подгружаются блоками при прокрутке.
 * Сервер (эмуляция) получает startRow/endRow, sortModel и filterModel,
 * возвращает блок и общее количество строк.
 * В этом примере мы показываем каждый запрос к "серверу" в консоли.
 */

const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => boolean>('onGridReady')

// Эмуляция базы данных: 10 000 записей
const allData = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `Сотрудник ${i + 1}`,
  age: 20 + (i % 50),
  salary: 50000 + (i % 200) * 1000,
}))

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Имя' },
  { field: 'age', headerName: 'Возраст', filter: 'agNumberColumnFilter' },
  {
    field: 'salary',
    headerName: 'Зарплата',
    filter: 'agNumberColumnFilter',
    valueFormatter: p => p.value ? `${p.value.toLocaleString('ru-RU')} ₽` : ''
  }
])

const defaultColDef = shallowRef<ColDef>({
  sortable: true,
  resizable: true,
  filter: true,
})

let gridApi: GridApi | null = null
let requestId = 0
let shouldLog = false

const datasource: IDatasource = {
  getRows(params: any) {
    const startRow = params.startRow
    const endRow = params.endRow
    const reqId = ++requestId

    if (shouldLog) {
      emit('log', `[Запрос ${reqId}] Загрузка строк ${startRow}–${endRow}...`)
    }

    setTimeout(() => {
      let data = [...allData]
      const filterModel = params.filterModel
      if (filterModel?.age?.filter) {
        const value = Number(filterModel.age.filter)
        data = data.filter(row => row.age >= value)
      }
      if (filterModel?.salary?.filter) {
        const value = Number(filterModel.salary.filter)
        data = data.filter(row => row.salary >= value)
      }

      const sortModel = params.sortModel
      if (sortModel.length > 0) {
        const { colId, sort } = sortModel[0]
        data.sort((a: any, b: any) => {
          const diff = a[colId] - b[colId]
          return sort === 'asc' ? diff : -diff
        })
      }

      const end = Math.min(endRow, data.length)
      const block = data.slice(startRow, end)

      if (shouldLog) {
        emit('log', `[Запрос ${reqId}] Отправлено ${block.length} строк (всего в БД: ${data.length})`)
      }

      params.successCallback(block, data.length)
    }, 200)
  }
}

function onGridReady(params: GridReadyEvent) {
  gridApi = params.api
  params.api.sizeColumnsToFit()

  // Используем возвращаемое значение родительского обработчика:
  // true при первом монтировании, false при последующих
  shouldLog = onGridReadyHandler?.() ?? false

  // Добавляем слушатель прокрутки: как только пользователь прокрутит, включаем логирование
  gridApi.addEventListener('bodyScroll', () => {
    shouldLog = true
  })
}

function onSortChanged(_: SortChangedEvent) {
  shouldLog = true
  emit('log', 'Сортировка изменена, данные будут запрошены заново')
}

function onFilterChanged(_: FilterChangedEvent) {
  shouldLog = true
  emit('log', 'Фильтры изменены, данные будут запрошены заново')
}
</script>
