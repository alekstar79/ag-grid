<script setup lang="ts">
import { ref } from 'vue'
import ConsoleOutput from '@/components/ConsoleOutput.vue'
import ExamplePage from '@/components/ExamplePage.vue'
import DemoComponent from '@/examples/Example6.demo.vue'
import demoCode from '@/examples/Example6.demo.vue?raw'

const logs = ref<string[]>([])
function onLog(message: string) {
  logs.value.push(`[${new Date().toLocaleTimeString()}] ${message}`)
}

const title = 'Закреплённых строки (pinned rows)'
const description = 'Закреплённая снизу строка автоматически показывает сумму зарплат. При редактировании данных (имя, зарплата) или добавлении нового сотрудника итог пересчитывается. Полезно для отчётов и сводных таблиц.'
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
