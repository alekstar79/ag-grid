<template>
  <div class="controls">
    <label>Язык: </label>
    <select v-model="lang" @change="onLangChange">
      <option value="ru">Русский</option>
      <option value="en">English</option>
    </select>
  </div>

  <AgGridVue
    :key="lang"
    style="flex: 1; width: 100%;"
    :rowData="rowData"
    :columnDefs="columnDefs"
    :defaultColDef="defaultColDef"
    :localeText="localeText"
    :animateRows="true"
    @grid-ready="onGridReady"
  />
</template>

<script setup lang="ts">
import { inject, ref, shallowRef, computed } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridApi, GridReadyEvent, HeaderValueGetterParams } from 'ag-grid-community'

const emit = defineEmits<{ (e: 'log', message: string): void }>()
const onGridReadyHandler = inject<() => void>('onGridReady')

const STORAGE_KEY = 'ag-grid-demo-lang'
const savedLang = (sessionStorage.getItem(STORAGE_KEY) as 'ru' | 'en') || 'ru'

const lang = ref<'ru' | 'en'>(savedLang)

// Словарь переводов
const translations: Record<string, Record<string, string>> = {
  ru: {
    'page': 'Страница',
    'of': 'из',
    'to': 'по',
    'loadingOoo': 'Загрузка...',
    'noRowsToShow': 'Нет данных',
    'filterOoo': 'Фильтр...',
    'equals': 'Равно',
    'notEqual': 'Не равно',
    'contains': 'Содержит',
    'startsWith': 'Начинается с',
    'endsWith': 'Заканчивается',
    'lessThan': 'Меньше',
    'greaterThan': 'Больше',
    'lessThanOrEqual': 'Меньше или равно',
    'greaterThanOrEqual': 'Больше или равно',
    'inRange': 'В диапазоне',
    'searchOoo': 'Поиск...',
    'selectAll': 'Выбрать все',
    'copy': 'Копировать',
    'export': 'Экспорт',
    'column.id': 'ID',
    'column.name': 'Имя',
    'column.age': 'Возраст',
    'column.salary': 'Зарплата',
    'data.employee': 'Сотрудник'
  },
  en: {
    'page': 'Page',
    'of': 'of',
    'to': 'to',
    'loadingOoo': 'Loading...',
    'noRowsToShow': 'No rows to show',
    'filterOoo': 'Filter...',
    'equals': 'Equals',
    'notEqual': 'Not equal',
    'contains': 'Contains',
    'startsWith': 'Starts with',
    'endsWith': 'Ends with',
    'lessThan': 'Less than',
    'greaterThan': 'Greater than',
    'lessThanOrEqual': 'Less than or equal',
    'greaterThanOrEqual': 'Greater than or equal',
    'inRange': 'In range',
    'searchOoo': 'Search...',
    'selectAll': 'Select all',
    'copy': 'Copy',
    'export': 'Export',
    'column.id': 'ID',
    'column.name': 'Name',
    'column.age': 'Age',
    'column.salary': 'Salary',
    'data.employee': 'Employee'
  }
}

// Текущий словарь
const currentTranslations = shallowRef(translations[lang.value])
const localeText = computed(() => currentTranslations.value)

// Функция перевода по ключу
function getLocale(key: string): string {
  return currentTranslations.value[key] ?? key
}

// Генератор заголовка колонки через токен по field
function headerValueGetter(params: HeaderValueGetterParams): string {
  const field = params.column?.getColDef().field
  return field ? getLocale(`column.${field}`) : ''
}

// Данные: computed, чтобы при смене локали пересоздавались имена
const rowData = computed(() =>
  Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `${getLocale('data.employee')} ${i + 1}`,
    age: 20 + (i % 30),
    salary: 50000 + (i * 1000)
  }))
)

// Набор columnDefs с токенами
const columnDefs: ColDef[] = [
  { field: 'id', headerName: 'ID', width: 80, headerValueGetter },
  { field: 'name', headerValueGetter, width: 150 },
  { field: 'age', headerValueGetter, filter: 'agNumberColumnFilter', width: 120 },
  {
    field: 'salary',
    headerValueGetter,
    valueFormatter: p => p.value ? `${p.value.toLocaleString('ru-RU')} ₽` : '',
    width: 160
  }
]

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

function onLangChange() {
  sessionStorage.setItem(STORAGE_KEY, lang.value)
  currentTranslations.value = translations[lang.value]
  emit('log', `Локаль изменена на ${lang.value === 'ru' ? 'русский' : 'английский'}`)
}
</script>

<style scoped>
.controls {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
}
.controls select {
  padding: 6px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
}
</style>
