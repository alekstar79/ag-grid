<script setup lang="ts">
import { ref } from 'vue'
import ConsoleOutput from '@/components/ConsoleOutput.vue'
import ExamplePage from '@/components/ExamplePage.vue'
import DemoComponent from '@/examples/Example8.demo.vue'
import demoCode from '@/examples/Example8.demo.vue?raw'

const logs = ref<string[]>([])
function onLog(message: string) {
  logs.value.push(`[${new Date().toLocaleTimeString()}] ${message}`)
}

const title = 'Транзакции (производительность)'
const description = 'Вместо полной перерисовки таблицы при каждом изменении, транзакции (applyTransaction) обновляют только изменённые строки. Это критически важно для производительности при работе с большими объёмами данных (сотни тысяч строк).'
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
