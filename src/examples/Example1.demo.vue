<template>
  <AgGridVue
    style="width: 100%; height: 100%"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :animateRows="true"
    @grid-ready="onGridReady"
  />
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridReadyEvent } from 'ag-grid-community'

interface Employee {
  id: number
  firstName: string
  lastName: string
  age: number
  salary: number
  status: 'active' | 'fired'
  hired: string
}

const rowData = ref<Employee[]>([
  { id: 1, firstName: 'Иван', lastName: 'Петров', age: 32, salary: 220000, status: 'active', hired: '2021-03-01' },
  { id: 2, firstName: 'Мария', lastName: 'Сидорова', age: 27, salary: 180000, status: 'fired', hired: '2022-07-15' },
  { id: 3, firstName: 'Алексей', lastName: 'Козлов', age: 41, salary: 250000, status: 'active', hired: '2019-11-20' },
])

const columnDefs = shallowRef<ColDef[]>([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'firstName', headerName: 'Имя' },
  { field: 'lastName', headerName: 'Фамилия' },
  { field: 'age', headerName: 'Возраст' },
  { field: 'salary', headerName: 'Зарплата' },
  { field: 'status', headerName: 'Статус' },
  { field: 'hired', headerName: 'Дата приема' },
])

function onGridReady(params: GridReadyEvent) {
  params.api.sizeColumnsToFit()
}
</script>

<style scoped>
/* любые стили, если нужны */
</style>
