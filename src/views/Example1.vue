<script setup lang="ts">
import ExamplePage from '@/components/ExamplePage.vue'
import DemoComponent from '@/examples/Example1.demo.vue'
import demoCode from '@/examples/Example1.demo.vue?raw'

const pageTitle = 'Сотрудники'
const pageDescription = 'Пример базовой таблицы с данными сотрудников. Используются стандартные колонки с фильтрацией и сортировкой (включены по умолчанию в ag-grid).'
</script>

<template>
  <ExamplePage
    :title="pageTitle"
    :description="pageDescription"
    :code="demoCode"
    language="html"
  >
    <DemoComponent />
  </ExamplePage>
</template>

<style scoped>
/* Дополнительные стили для этой страницы не нужны - всё в ExamplePage */
</style>
