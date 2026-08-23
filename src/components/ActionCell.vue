<script setup lang="ts">
const props = defineProps<{ params: any }>()

function onClick() {
  const parent = props.params.context?.parent

  if (parent?.onRowAction) {
    parent.onRowAction(props.params.data)
  }
}
</script>

<template>
  <button @click="onClick">Открыть</button>
</template>
