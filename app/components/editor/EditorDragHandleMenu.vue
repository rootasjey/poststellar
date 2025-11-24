<template>
  <NDropdownMenu v-if="editor" :items="dragMenuItems" class="drag-handle-dropdown">
    <template #default>
      <DragHandle :editor="editor" :onNodeChange="onNodeChange" class="editor-drag-handle" role="button" aria-label="Drag block" tabindex="0">
        <NIcon name="i-ph-dots-six-vertical-bold" />
      </DragHandle>
    </template>
  </NDropdownMenu>
</template>

<script setup lang="ts">
import { computed, ref, unref } from 'vue'
import type { Ref } from 'vue'
// NodeSelection used to be required when forcing selection on click — actions
// now operate on reported node positions so we don't need to change selection.
import type { Editor } from '@tiptap/vue-3'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import DragHandle from '@tiptap/extension-drag-handle-vue-3'
import { textPalette, backgroundPalette } from './palette'

const props = defineProps<{ editor: Editor | Ref<Editor | null> | null, blockTypes: any[] }>()
const { editor, blockTypes = [] } = props

// The drag handle extension provides an `onNodeChange` callback with the
// currently targeted node and its document position. We store the last known
// `nodePos` so menu actions can act explicitly on the block related to the
// clicked handle instead of relying on the editor caret position.
const nodePos = ref<number | null>(null)
const dragHandleNode = ref<ProseMirrorNode | null>(null)

interface DragHandleChange {
  node: ProseMirrorNode | null
  pos?: number | null
  [key: string]: unknown
}

function onNodeChange(data: DragHandleChange | null): void {
  dragHandleNode.value = data?.node || null
  if (!data || !data.node) {
    nodePos.value = null
    return
  }
  // `pos` from DragHandle refers to the start position of the node.
  nodePos.value = typeof data.pos === 'number' ? data.pos : null
}

function applyColorToBlock(color: string) {
  const ed: any = unref(editor)
  if (!ed || nodePos.value === null || !dragHandleNode.value) return

  const pos = nodePos.value
  const node = dragHandleNode.value
  const from = pos + 1
  const to = pos + node.nodeSize - 1

  if (to > from) {
    ed.chain().focus().setTextSelection({ from, to }).setColor(color).run()
  }
}

function duplicateNode() {
  const ed: any = unref(editor)
  if (!ed || nodePos.value === null || !dragHandleNode.value) return

  const pos = nodePos.value
  const node = dragHandleNode.value

  ed.chain().focus().insertContentAt(pos + node.nodeSize, node.toJSON()).run()
}

function resetFormatting() {
  const ed: any = unref(editor)
  if (!ed || nodePos.value === null || !dragHandleNode.value) return

  const pos = nodePos.value
  const node = dragHandleNode.value
  const from = pos + 1
  const to = pos + node.nodeSize - 1

  // First run chainable unsets where available
  ed.chain().focus().setTextSelection({ from, to }).unsetColor().unsetHighlight().unsetBackgroundColor().extendMarkRange('link').unsetLink().run()

  // Remove common marks directly via transaction to ensure all marks are cleared
  const tr = ed.state.tr
  const schema = ed.state.schema
  const marksToClear = ['bold', 'italic', 'strike', 'code', 'underline']
  for (const m of marksToClear) {
    const markType = (schema.marks as any)[m]
    if (markType) tr.removeMark(from, to, markType)
  }

  if (tr.docChanged) ed.view.dispatch(tr)
}

function copyBlockToClipboard() {
  const ed: any = unref(editor)
  if (!ed || nodePos.value === null || !dragHandleNode.value) return

  const pos = nodePos.value
  const node = dragHandleNode.value
  const curSel = ed.state.selection

  ed.chain().focus().setNodeSelection(pos).run()

  let copied = false
  try { copied = document.execCommand('copy') } catch { copied = false }

  if (!copied) {
    const text = node.textContent || ''
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text)
  }

  const tr = ed.state.tr.setSelection(curSel)
  ed.view.dispatch(tr)
  ed.view.focus()
}

function deleteBlock() {
  const ed = unref(editor)
  if (!ed || nodePos.value === null || !dragHandleNode.value) return

  const pos = nodePos.value
  const node = dragHandleNode.value
  ed.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
}

const currentBlockType = computed(() => (blockTypes || []).find(t => t.isActive && t.isActive()) || (blockTypes || [])[0])

const dragMenuItems = computed(() => {
  const turnIntoItems = (blockTypes || []).slice(0,4).map(t => ({
    label: t.label,
    leading: t.icon,
    onSelect: () => {
      const ed = unref(editor)
      if (ed && nodePos.value !== null) {
         ed.chain().setNodeSelection(nodePos.value).run()
      }
      t.action()
    }
  }))
  // produce two classes: a leading 'letter' class and a sanitized color class
  // sanitize so '#111827' -> '111827' (no leading hyphen)
  const sanitizeColorClass = (c: string) => {
    const sanitized = c.replace(/[^a-z0-9]+/ig, '-').replace(/(^-|-$)/g, '').toLowerCase()
    return `color-letter color-${sanitized}`
  }
  // human-friendly labels for the editor palette
  const colorLabelMap: Record<string, string> = {
    '#111827': 'Default text',
    '#374151': 'Gray text',
    '#6B7280': 'Muted text',
    '#ef4444': 'Red text',
    '#f97316': 'Orange text',
    '#f59e0b': 'Yellow text',
    '#10b981': 'Green text',
    '#3b82f6': 'Blue text',
    '#6366f1': 'Indigo text',
    '#8b5cf6': 'Purple text',
    '#ec4899': 'Pink text',
  }

  const backgroundLabelMap: Record<string, string> = {
    '#fff7ed': 'Warm background',
    '#ffedd5': 'Peach background',
    '#fef3c7': 'Sunny background',
    '#ecfeff': 'Cyan background',
    '#ecfccb': 'Lime background',
    '#eef2ff': 'Indigo background',
    '#FEEBF6': 'Soft pink background',
    '#EBD6FB': 'Lavender background',
    '#8F87F1': 'Periwinkle background',
    '#C68EFD': 'Lilac background',
  }
  const colorItems = textPalette.slice(0,9).map(col => ({
    label: colorLabelMap[col] ?? col,
    leading: sanitizeColorClass(col),
    onSelect: () => applyColorToBlock(col)
  }))

  // background items for the drag handle menu (applies background to block)
  function applyBackgroundToBlock(color: string) {
    const ed: any = unref(editor)
    if (!ed || nodePos.value === null || !dragHandleNode.value) return

    const pos = nodePos.value
    // select the whole node and set background color
    ed.chain().focus().setNodeSelection(pos).setBackgroundColor(color).run()
  }

  function clearBackgroundForBlock() {
    const ed: any = unref(editor)
    if (!ed || nodePos.value === null || !dragHandleNode.value) return

    const pos = nodePos.value
    ed.chain().focus().setNodeSelection(pos).unsetBackgroundColor().run()
  }

  const sanitizeDotClass = (c: string) => {
    const sanitized = c.replace(/[^a-z0-9]+/ig, '-').replace(/(^-|-$)/g, '').toLowerCase()
    return `color-dot color-${sanitized}`
  }

  const backgroundItems = [
    { label: 'Default background', leading: 'dot-clear', onSelect: clearBackgroundForBlock },
    ...backgroundPalette.slice(0,9).map(col => ({
      label: backgroundLabelMap[col] ?? col,
      leading: sanitizeDotClass(col),
      onSelect: () => applyBackgroundToBlock(col),
    }))
  ]
  return [
    { 
      label: (currentBlockType.value?.label ?? 'Block'), 
      items: [ 
        { label: 'Color', items: colorItems, leading: 'i-ph-paint-brush' }, 
        { label: 'Background', items: backgroundItems, leading: 'i-ph-paint-bucket' }, 
        {},
        { label: 'Turn Into', items: turnIntoItems, leading: 'i-ph-swap' } ],
    },
    { label: 'Reset formatting', onSelect: resetFormatting, leading: 'i-lucide-eraser' },
    {},
    { label: 'Duplicate node', onSelect: duplicateNode, leading: 'i-lucide-copy' },
    { label: 'Copy to clipboard', onSelect: copyBlockToClipboard, leading: 'i-lucide-clipboard' },
    {},
    { label: 'Delete', onSelect: deleteBlock, leading: 'i-lucide-trash', color: 'danger' }
  ]
})
</script>

<style scoped>
.drag-handle-dropdown { display: inline-block }

/* keep only local layout-related rules here; color-dot is global (menu portals) */
</style>
