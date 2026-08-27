<script setup lang="ts">
import { ref } from 'vue'
import ConsoleOutput from '@/components/ConsoleOutput.vue'
import ExamplePage from '@/components/ExamplePage.vue'
import DemoComponent from '@/examples/Example15.demo.vue'
import demoCode from '@/examples/Example15.demo.vue?raw'

const logs = ref<string[]>([])
function onLog(message: string) {
  logs.value.push(`[${new Date().toLocaleTimeString()}] ${message}`)
}

const title = 'Группировка и агрегация'
const description = 'Демонстрация группировки строк по региону и агрегации выручки с помощью функции sum.'
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
