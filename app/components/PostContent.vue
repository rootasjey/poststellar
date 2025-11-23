<template>
  <PostEditor v-if="editable" :content="content" @update:content="forwardContent" @editor-ready="forwardEditor" />
  <PostViewer v-else :content="content" />
</template>

<script setup lang="ts">
import PostEditor from './editor/PostEditor.vue'
import PostViewer from './editor/PostViewer.vue'

interface Props { content: string | object; editable?: boolean }

withDefaults(defineProps<Props>(), { editable: false })
const emit = defineEmits<{ 'update:content': [json: object]; 'editor-ready': [editor: any] }>()

function forwardContent(json: object) { emit('update:content', json) }
function forwardEditor(ed: any) { emit('editor-ready', ed) }
</script>
