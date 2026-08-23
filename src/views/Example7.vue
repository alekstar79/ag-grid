<script setup lang="ts">
import { ref } from 'vue'
import ConsoleOutput from '@/components/ConsoleOutput.vue'
import ExamplePage from '@/components/ExamplePage.vue'
import DemoComponent from '@/examples/Example7.demo.vue'
import demoCode from '@/examples/Example7.demo.vue?raw'

const logs = ref<string[]>([])
function onLog(message: string) {
  logs.value.push(`[${new Date().toLocaleTimeString()}] ${message}`)
}

const title = 'Сохранение состояния'
const description = 'Таблица сохраняет данные, ширину колонок, порядок, сортировку и фильтры в localStorage. При перезагрузке страницы состояние восстанавливается. Также можно добавлять, удалять и редактировать записи.'
</script>

<template>
  <ExamplePage
    :title="title"
    :description="description"
    :code="demoCode"
    language="html"
    @log="onLog"
  >
    <DemoComponent @log="onLog" />
    <template v-slot:console>
      <ConsoleOutput :logs="logs" />
    </template>
  </ExamplePage>
</template>
