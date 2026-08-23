<script setup lang="ts">
import { ref } from 'vue'
import ConsoleOutput from '@/components/ConsoleOutput.vue'
import ExamplePage from '@/components/ExamplePage.vue'
import DemoComponent from '@/examples/Example3.demo.vue'
import demoCode from '@/examples/Example3.demo.vue?raw'

const logs = ref<string[]>([])
function onLog(message: string) {
  logs.value.push(`[${new Date().toLocaleTimeString()}] ${message}`)
}

const pageTitle = 'Фильтрация'
const pageDescription = 'Демонстрация быстрого поиска (quick filter), floating filter, внешнего фильтра (по статусу) и программного управления фильтрами.'
</script>

<template>
  <ExamplePage
    :title="pageTitle"
    :description="pageDescription"
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
