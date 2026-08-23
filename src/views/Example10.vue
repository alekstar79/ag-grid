<script setup lang="ts">
import { ref } from 'vue'
import ConsoleOutput from '@/components/ConsoleOutput.vue'
import ExamplePage from '@/components/ExamplePage.vue'
import DemoComponent from '@/examples/Example10.demo.vue'
import demoCode from '@/examples/Example10.demo.vue?raw'

const logs = ref<string[]>([])
function onLog(message: string) {
  logs.value.push(`[${new Date().toLocaleTimeString()}] ${message}`)
}

const title = 'Кастомный фильтр'
const description = 'Vue-компонент фильтра по диапазону возраста. Показывает реализацию интерфейса IFilter: isFilterActive, doesFilterPass, getModel, setModel, afterGuiAttached. Используйте фильтр в колонке или пресеты сверху.'
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
