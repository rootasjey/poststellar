<template>
  <div class="post-content relative">
    <!-- Upload progress indicators for inline images -->
    <div v-if="uploadingImages.length > 0" class="upload-indicator fixed top-4 right-4 z-50 w-64 bg-background border border-border rounded-lg shadow-lg p-2">
      <div class="font-semibold text-sm mb-2">Uploading image{{ uploadingImages.length > 1 ? 's' : '' }}</div>
      <div class="space-y-2 max-h-40 overflow-auto">
        <div v-for="u in uploadingImages" :key="u.id" class="flex items-center gap-2">
          <div class="flex-1">
            <div class="text-xs truncate">{{ u.name }}</div>
            <div class="h-2 bg-muted rounded mt-1 overflow-hidden">
              <div class="h-full bg-primary transition-all" :style="{ width: u.progress + '%' }"></div>
            </div>
          </div>
          <div class="text-xs w-10 text-right">{{ u.progress }}%</div>
          <button @click.prevent="cancelUpload(u.id)" type="button" class="text-xs ml-1 p-1 rounded hover:bg-muted" title="Cancel upload">
            <span class="i-lucide-x" />
          </button>
        </div>
      </div>
    </div>

    <EditorBubbleMenu v-if="editor" :editor="editor" :block-types="blockTypes" :identifier="String(routeForUpload.params.identifier || '')" />

    <FloatingSlashMenu
      v-if="editor"
      :editor="editor"
      :editable="true"
      :should-show="shouldShowFloatingMenu"
      :actions="floatingActions"
      @select="selectFloatingAction"
      :onInsertImages="onInsertImages"
    />

    <EditorContent v-if="editor" :editor="editor" />

    <EditorDragHandleMenu v-if="editor" :editor="editor" :block-types="blockTypes" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent, Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle, BackgroundColor } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Image from '@tiptap/extension-image'
import NodeRange from '@tiptap/extension-node-range'
import EditorDragHandleMenu from './EditorDragHandleMenu.vue'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import FileHandler from '@tiptap/extension-file-handler'
import { watch, onBeforeUnmount, computed } from 'vue'
import FloatingSlashMenu from '../FloatingSlashMenu.vue'
import EditorBubbleMenu from './EditorBubbleMenu.vue'
import { useRoute } from '#imports'
import type { EditorState } from '@tiptap/pm/state'

interface Props { content: string | object }
const props = defineProps<Props>()

const emit = defineEmits<{ 'update:content': [json: object]; 'editor-ready': [editor: any] }>()

const {
  uploadingImages, 
  addUploading, 
  updateUploading, 
  removeUploading, 
  uploadFileWithProgress, 
  cancelUpload,
} = useEditorImages()

const routeForUpload = useRoute()

const editor = useEditor({
  content: props.content,
  editable: true,
  extensions: [
    StarterKit.configure({ heading: { levels: [1, 2, 3, 4] }, link: { openOnClick: false } }),
    FileHandler.configure({
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      onDrop: async (currentEditor, files, pos) => handleFiles(currentEditor, files, pos),
      onPaste: async (currentEditor, files) => handleFiles(currentEditor, files, currentEditor.state.selection.anchor),
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'paragraph') return 'Here is my thoughts about... (/ for commands)'
        if (node.type.name === 'heading') return 'Heading...'
        return ''
      },
      includeChildren: true,
    }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Image,
    Table.configure({ resizable: true }),
    TextStyle,
    BackgroundColor,
    Color,
    Highlight.configure({ multicolor: true }),
    NodeRange,
    TableRow,
    TableHeader,
    TableCell,
  ],
  editorProps: { attributes: { class: 'prose prose-lg max-w-none focus:outline-none' } },
  onUpdate: ({ editor }) => emit('update:content', editor.getJSON()),
})

// Expose editor when ready
watch(() => editor.value, (ed) => { if (ed) emit('editor-ready', ed) }, { immediate: true })

async function handleFiles(currentEditor: any, files: File[], pos: number) {
  const identifier = String(routeForUpload.params.identifier ?? '')
  for (const file of files) {
    const uploadId = addUploading(file.name)
    try {
      if (identifier) {
        try {
          const json = await uploadFileWithProgress(identifier, file, (p: number) => updateUploading(uploadId, p), uploadId)
          const src = json?.image?.src ?? null
          if (src) {
            currentEditor.chain().insertContentAt(pos, { type: 'image', attrs: { src } }).focus().run()
            continue
          }
        } catch (e: any) {
          if (e && typeof e === 'object' && (e as any).aborted) continue
        }
      }
      // Fallback base64 inline
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      await new Promise<void>((resolve) => {
        fileReader.onload = () => {
          currentEditor.chain().insertContentAt(pos, { type: 'image', attrs: { src: fileReader.result } }).focus().run()
          resolve()
        }
      })
    } catch {
      const fr = new FileReader()
      fr.readAsDataURL(file)
      fr.onload = () => {
        currentEditor.chain().insertContentAt(pos, { type: 'image', attrs: { src: fr.result } }).focus().run()
      }
    } finally {
      removeUploading(uploadId)
    }
  }
}

const blockTypes = [
  { label: 'Text', icon: 'i-lucide-pilcrow', isActive: () => editor.value?.isActive('paragraph'), action: () => editor.value?.chain().focus().setParagraph().run() },
  { label: 'Heading 1', icon: 'i-lucide-heading-1', isActive: () => !!editor.value?.isActive('heading', { level: 1 }), action: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run() },
  { label: 'Heading 2', icon: 'i-lucide-heading-2', isActive: () => !!editor.value?.isActive('heading', { level: 2 }), action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run() },
  { label: 'Heading 3', icon: 'i-lucide-heading-3', isActive: () => editor.value?.isActive('heading', { level: 3 }), action: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run() },
  { label: 'Bullet List', icon: 'i-lucide-list', isActive: () => !!editor.value?.isActive('bulletList'), action: () => editor.value?.chain().focus().toggleBulletList().run() },
  { label: 'Numbered List', icon: 'i-lucide-list-ordered', isActive: () => !!editor.value?.isActive('orderedList'), action: () => editor.value?.chain().focus().toggleOrderedList().run() },
  { label: 'To-do List', icon: 'i-lucide-check-square', isActive: () => !!editor.value?.isActive('taskList'), action: () => editor.value?.chain().focus().toggleTaskList().run() },
  { label: 'Blockquote', icon: 'i-lucide-quote', isActive: () => !!editor.value?.isActive('blockquote'), action: () => editor.value?.chain().focus().toggleBlockquote().run() },
  { label: 'Code Block', icon: 'i-lucide-code-2', isActive: () => editor.value?.isActive('codeBlock'), action: () => editor.value?.chain().focus().toggleCodeBlock().run() },
]

interface FloatingAction { label: string; icon?: string; isActive?: () => boolean; action: () => void | Promise<void> }
const floatingActions: FloatingAction[] = [
  { label: 'H1', icon: 'i-lucide-heading-1', isActive: () => editor.value?.isActive('heading', { level: 1 }) ?? false, action: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run() },
  { label: 'H2', icon: 'i-lucide-heading-2', isActive: () => editor.value?.isActive('heading', { level: 2 }) ?? false, action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run() },
  { label: 'H3', icon: 'i-lucide-heading-3', isActive: () => editor.value?.isActive('heading', { level: 3 }) ?? false, action: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run() },
  { label: 'Bulleted', icon: 'i-lucide-list', isActive: () => editor.value?.isActive('bulletList') ?? false, action: () => toggleBulletListWithEnter() },
  { label: 'Numbered', icon: 'i-lucide-list-ordered', isActive: () => editor.value?.isActive('orderedList') ?? false, action: () => editor.value?.chain().focus().toggleOrderedList().run() },
  { label: 'To-do', icon: 'i-lucide-check-square', isActive: () => editor.value?.isActive('taskList') ?? false, action: () => editor.value?.chain().focus().toggleTaskList().run() },
  { label: 'Blockquote', icon: 'i-lucide-quote', isActive: () => editor.value?.isActive('blockquote') ?? false, action: () => editor.value?.chain().focus().toggleBlockquote().run() },
  { label: 'Image', icon: 'i-lucide-image', action: () => addImage() },
]

function deleteSlashIfPresent() {
  const ed = editor.value; if (!ed) return
  const pos = ed.state.selection.from; if (typeof pos !== 'number' || pos <= 0) return
  try {
    const charBefore = ed.state.doc.textBetween(pos - 1, pos, '', '\n')
    if (charBefore !== '/') return
    const tr = ed.state.tr.delete(pos - 1, pos)
    ed.view.dispatch(tr)
    ed.chain().focus().setTextSelection(pos - 1).run()
  } catch {}
}

function selectFloatingAction(item: FloatingAction) {
  if (!editor.value) return
  deleteSlashIfPresent()
  item.action?.()
  editor.value.chain().focus().run()
}

function toggleBulletListWithEnter() {
  if (!editor.value) return
  editor.value.chain().focus().toggleBulletList().run()
  if (!editor.value.isActive('bulletList')) return
  editor.value.chain().focus().splitListItem('listItem').run()
}

function shouldShowFloatingMenu(props: any) {
  if (!props || !props.state) return false
  const state = props.state as EditorState
  const { selection } = state
  if (!selection.empty) return false
  const pos = selection.from; if (typeof pos !== 'number' || pos <= 0) return false
  try { return state.doc.textBetween(pos - 1, pos, '', '\n') === '/' } catch { return false }
}


function addImage() {
  // Fallback: prompt for URL if file picker not available
  const url = window.prompt('Image URL')
  if (url && editor.value) editor.value.chain().focus().setImage({ src: url }).run()
}

function onInsertImages(files: FileList) {
  if (!editor.value || !files?.length) return
  const pos = editor.value.state.selection.anchor
  handleFiles(editor.value, Array.from(files), pos)
}

// Keep external content sync if parent updates
watch(() => props.content, (newContent) => {
  if (!editor.value || !newContent) return
  if (typeof newContent !== 'string') { editor.value.commands.setContent(newContent); return }
  if (editor.value.getHTML() !== newContent) editor.value.commands.setContent(newContent)
})

onBeforeUnmount(() => editor.value?.destroy())
</script>

<style scoped>
.color-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.25rem; }
.color-swatch { width: 1.25rem; height: 1.25rem; border-radius: 0.45rem; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 0 0 1px rgba(0,0,0,0.02) inset; transition: all 0.2s; }
.color-swatch.clear { display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: var(--un-foreground-color, #111827); background: transparent; }
.dark .color-swatch.clear { color: var(--un-foreground-color, #f9fafb); border: 1px solid rgba(255,255,255,0.3); }
.color-swatch:hover { transform: scale(1.2); }
.color-swatch:active { transform: scale(0.9); }
.color-preview { display: inline-block; width: 0.9rem; height: 0.9rem; margin-left: 0.375rem; border-radius: 9999px; border: 2px solid transparent; }
</style>
