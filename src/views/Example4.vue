<script setup lang="ts">
import { ref } from 'vue'
import ConsoleOutput from '@/components/ConsoleOutput.vue'
import ExamplePage from '@/components/ExamplePage.vue'
import DemoComponent from '@/examples/Example4.demo.vue'
import demoCode from '@/examples/Example4.demo.vue?raw'

const logs = ref<string[]>([])
function onLog(message: string) {
  logs.value.push(`[${new Date().toLocaleTimeString()}] ${message}`)
}

const pageTitle = 'Cell Renderer и Editor'
const pageDescription = 'Демонстрация кастомных рендереров (StatusBadge, ActionCell), редактирования ячеек и обработки события изменения.'
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
