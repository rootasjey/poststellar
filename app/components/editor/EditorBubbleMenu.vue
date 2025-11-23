<template>
  <BubbleMenu
    v-if="editor"
    :editor="editor"
    :options="{ placement: 'top' }"
    :should-show="shouldShowFormattingMenu"
    class="bubble-menu"
    @pointerdown="onBubbleMenuPointerDown"
  >
    <NDropdownMenu 
      modal
      :items="blockDropdownItems"
      class="menu-block-type"
      :_dropdown-menu-content="blockDropDownMenuContent"
    >
      <NButton
        btn="~"
        class="flex items-center gap-1 px-2 py-1 hover:bg-muted rounded text-sm font-medium min-w-[120px]"
        :leading="currentBlockType?.icon"
      >
        <span class="flex-1 text-left">{{ currentBlockType?.label }}</span>
        <span class="i-lucide-chevron-down text-xs opacity-50" />
      </NButton>
    </NDropdownMenu>

    <div class="divider" />

    <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" type="button">
      <span class="i-lucide-bold" />
    </button>
    <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" type="button">
      <span class="i-lucide-italic" />
    </button>
    <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }" type="button">
      <span class="i-lucide-strikethrough" />
    </button>
    <button @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }" type="button">
      <span class="i-lucide-code" />
    </button>

    <div class="divider" />

    <NPopover
      modal
      v-if="editor"
      :show="linkVisible"
      @update:show="onPopoverUpdate"
      :show-arrow="false"
      :_popover-content="linkPopoverContent"
    >
      <template #trigger>
        <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }" type="button">
          <span class="i-lucide-link" />
        </button>
      </template>

      <div class="flex items-center gap-2 p-0">
        <NInput
          v-model:value="linkUrl"
          ref="linkInput"
          input="outline"
          placeholder="Paste link..."
          aria-label="Link URL"
          class="min-w-[120px] border-none ring-none shadow-none focus:outline-none focus:ring-0"
          @keydown.enter.prevent="updateLink"
          @keydown.esc="editor.commands.focus()"
        />
        <div class="flex items-center gap-1 border-l border-border p-1">
          <NButton v-if="linkUrl" @click="openLink" icon btn="ghost-gray" size="xs" title="Open Link" rounded="3">
            <span class="i-lucide-external-link text-sm" />
          </NButton>
          <NButton @click="removeLink" icon btn="ghost-gray" size="sm" title="Remove Link" rounded="3">
            <span class="i-lucide-trash text-sm" />
          </NButton>
        </div>
      </div>
    </NPopover>

    <EditorColorPopover :editor="props.editor" v-model:open="colorVisible" />
  </BubbleMenu>
</template>

<script setup lang="ts">
import { BubbleMenu } from '@tiptap/vue-3/menus'
import type { Editor } from '@tiptap/vue-3'
import { ref, computed, nextTick, watch } from 'vue'
import EditorColorPopover from './EditorColorPopover.vue'
import type { FocusOutsideEvent, PointerDownOutsideEvent } from '@una-ui/nuxt'
import type { EditorState } from '@tiptap/pm/state'

interface BlockType {
  label: string
  icon: string
  isActive: () => boolean | undefined
  action: () => void
}

interface Props { editor: Editor | null; blockTypes: BlockType[] }
const props = defineProps<Props>()

const currentBlockType = computed(() => props.blockTypes.find(t => t.isActive()) || props.blockTypes[0])

const blockDropdownItems = computed(() => {
  const textGroup = props.blockTypes.slice(0, 4).map(t => ({ label: t.label, leading: t.icon, trailing: t.isActive() ? 'i-ph-check' : undefined, onSelect: () => t.action() }))
  const otherGroup = props.blockTypes.slice(4).map(t => ({ label: t.label, leading: t.icon, trailing: t.isActive() ? 'i-ph-check' : undefined, onSelect: () => t.action() }))
  return [ { label: 'Turn Into', items: textGroup }, { label: 'Format', items: otherGroup } ]
})

/**
 * Prevent the editor from losing focus when clicking inside the bubble menu.
 * Only prevent default if the click is inside the bubble menu but not on interactive elements.
 * @param e - PointerEvent
 */
function onBubbleMenuPointerDown(e: PointerEvent) {
  const target = e.target as HTMLElement
  if (target.closest('.bubble-menu') && !target.closest('button, a, input, textarea, select')) {
    e.preventDefault()
  }
}

// function onBubbleMenuClick(e: MouseEvent) {
//   // Prevent the editor from losing focus when clicking inside the bubble menu
//   console.log('3•(bubble menu) click', e)
//   restoreNodeSelection()
// }

const blockDropDownMenuContent = { 
  class: 'py-1 px-0 w-auto rounded-4',
  onInteractOutside: onInteractOutside,
}

const linkPopoverContent = { 
  class: 'py-0 px-1 w-auto rounded-4',
  onInteractOutside: onInteractOutside,
}

// const savedSelection = ref<{ from: number; to: number } | null>(null)

// function saveNodeSelection() {
//   if (!props.editor) return
//   const { from, to, empty } = props.editor.state.selection
//   if (!empty) savedSelection.value = { from, to }
//   console.log('0•save selection', savedSelection.value)
// }

// function restoreNodeSelection() {
//   if (!props.editor || !savedSelection.value) return
//   const sel = savedSelection.value
//   // restore on next tick so popover has closed and the editor is ready
//   nextTick(() => {
//     try { props.editor?.chain().focus().setTextSelection({ from: sel.from, to: sel.to }).run() } catch {}
//     savedSelection.value = null
//   })
// }

function onInteractOutside(e: PointerDownOutsideEvent | FocusOutsideEvent) {
  e.detail.originalEvent.preventDefault()
}

// Link editing logic
const linkUrl = ref('')
const manualLinkOpen = ref(false)
const linkInput = ref<any | null>(null)

const linkVisible = computed(() => props.editor?.isActive('link') && (manualLinkOpen.value || !props.editor?.state.selection.empty))

// Keep track of the color popover visibility so the bubble menu can remain open
const colorVisible = ref(false)

function setLink() {
  if (!props.editor) return
  const previousUrl = props.editor.getAttributes('link').href
  linkUrl.value = previousUrl || ''
  if (props.editor.isActive('link')) return
  const { from, empty } = props.editor.state.selection
  if (!empty) { props.editor.chain().focus().extendMarkRange('link').setLink({ href: '' }).run(); manualLinkOpen.value = true; return }
  const placeholder = 'link'
  props.editor.chain().focus().insertContentAt(from, placeholder).setTextSelection({ from, to: from + placeholder.length }).extendMarkRange('link').setLink({ href: '' }).run()
  manualLinkOpen.value = true
}
function updateLink() { if (linkUrl.value === '') props.editor?.chain().focus().extendMarkRange('link').unsetLink().run(); else props.editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.value }).run() }
function removeLink() { props.editor?.chain().focus().extendMarkRange('link').unsetLink().run() }
function openLink() { if (linkUrl.value) window.open(linkUrl.value, '_blank') }
function onPopoverUpdate(v: boolean) { if (!v) manualLinkOpen.value = false }

watch(linkVisible, async (showing) => {
  if (!showing) { manualLinkOpen.value = false; return }
  linkUrl.value = props.editor?.getAttributes('link').href || ''
  await nextTick()
  const el = linkInput.value?.$el || linkInput.value
  const input = el?.querySelector?.('input')
  input?.focus()
  const val = input?.value
  input?.setSelectionRange?.(val?.length ?? 0, val?.length ?? 0)
})

// Keep formatting menu open when there's a selection or manual link editing
function shouldShowFormattingMenu(ctx: { state: EditorState; editor: any }) {
  const { state, editor } = ctx
  const { empty } = state.selection
  // saveNodeSelection()
  return !empty || (editor.isActive('link') && manualLinkOpen.value) || colorVisible.value
}
</script>
