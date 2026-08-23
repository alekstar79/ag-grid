<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'

// Регистрируем нужные языки
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('vue', xml) // упрощённо
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)

// Подключаем стиль темы (можно выбрать любую тему из highlight.js/styles)
import 'highlight.js/styles/atom-one-dark.css'

const props = defineProps<{
  code: string
  language?: string
}>()

const codeRef = ref<HTMLElement | null>(null)
const highlighted = ref('')

function highlight() {
  if (!codeRef.value) return
  const lang = props.language || 'javascript'
  try {
    const result = hljs.highlight(props.code, { language: lang, ignoreIllegals: true })
    highlighted.value = result.value
  } catch {
    highlighted.value = props.code
  }
}

onMounted(highlight)
watch(() => [props.code, props.language], highlight, { deep: true })
</script>

<template>
  <pre><code ref="codeRef" class="hljs" v-html="highlighted"></code></pre>
</template>

<style scoped>
pre {
  margin: 0;
  padding: 0;
  background: transparent;
}
code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  display: block;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
