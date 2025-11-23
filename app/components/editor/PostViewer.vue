<template>
  <div class="post-content relative">
    <EditorContent v-if="editor" :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { watch } from 'vue'

interface Props {
  content: string | object
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false
})

// Read-only editor for displaying already saved article content
const editor = useEditor({
  content: props.content,
  editable: false,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4] },
    }),
    Image,
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'paragraph') return 'Loading content…'
        return ''
      },
      includeChildren: true,
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-lg max-w-none focus:outline-none',
    },
  },
})

// Sync when parent updates content externally
watch(() => props.content, (newContent) => {
  if (!editor.value || !newContent) return
  if (typeof newContent !== 'string') {
    editor.value.commands.setContent(newContent)
    return
  }
  if (editor.value.getHTML() !== newContent) {
    editor.value.commands.setContent(newContent)
  }
})
</script>
