<template>
  <BubbleMenu
    v-if="editor"
    :editor="editor"
    :options="{ placement: 'top' }"
    :should-show="shouldShowMenu"
    class="bubble-menu"
    @pointerdown="onBubbleMenuPointerDown"
  >
    <!-- Image specific actions -->
    <template v-if="imageSelected">
      <button type="button" @click="downloadSelectedImage" title="Download image">
        <span class="i-lucide-download" />
      </button>
      <button type="button" @click="triggerReplace" title="Replace image">
        <span class="i-lucide-refresh-ccw" />
      </button>
      <button type="button" @click="deleteSelectedImage" title="Delete image" :class="{ 'is-active': false }">
        <span class="i-lucide-trash" />
      </button>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFilePicked" />
    </template>
    <!-- Formatting actions (default) -->
    <template v-else>
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
    </template>
  </BubbleMenu>
</template>

<script setup lang="ts">
import { BubbleMenu } from '@tiptap/vue-3/menus'
import type { Editor } from '@tiptap/vue-3'
import { ref, computed, nextTick, watch } from 'vue'
import EditorColorPopover from './EditorColorPopover.vue'
import type { FocusOutsideEvent, PointerDownOutsideEvent } from '@una-ui/nuxt'
import type { EditorState } from '@tiptap/pm/state'
import { useRoute } from '#imports'

interface BlockType {
  label: string
  icon: string
  isActive: () => boolean | undefined
  action: () => void
}

interface Props { editor: Editor | null; blockTypes: BlockType[]; identifier?: string }
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

const blockDropDownMenuContent = { 
  class: 'py-1 px-0 w-auto rounded-4',
  onInteractOutside: onInteractOutside,
}

const linkPopoverContent = { 
  class: 'py-0 px-1 w-auto rounded-4',
  onInteractOutside: onInteractOutside,
}

function onInteractOutside(e: PointerDownOutsideEvent | FocusOutsideEvent) {
  e.detail.originalEvent.preventDefault()
}

const linkUrl = ref('')
const manualLinkOpen = ref(false)
const linkInput = ref<any | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Image selection detection
const imageSelected = computed(() => !!props.editor?.isActive('image'))

// Upload helpers (shared composable state)
const { addUploading, updateUploading, removeUploading, uploadFileWithProgress } = useEditorImages()
const currentRoute = useRoute()

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
function shouldShowMenu(ctx: { state: EditorState; editor: any }) {
  const { state, editor } = ctx
  if (imageSelected.value) return true
  const { empty } = state.selection
  return !empty || (editor.isActive('link') && manualLinkOpen.value) || colorVisible.value
}

function downloadSelectedImage() {
  const src = props.editor?.getAttributes('image')?.src
  if (!src) return
  const a = document.createElement('a')
  a.href = src
  a.download = src.split('/').pop() || 'image'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function triggerReplace() {
  fileInput.value?.click()
}

async function onFilePicked(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !props.editor) return
  const identifier = props.identifier || String(currentRoute.params.identifier || '')
  const uploadId = addUploading(file.name)
  try {
    if (identifier) {
      try {
        const json = await uploadFileWithProgress(identifier, file, (p: number) => updateUploading(uploadId, p), uploadId)
        const src = json?.image?.src
        if (src) {
          props.editor.chain().focus().updateAttributes('image', { src }).run()
          return
        }
      } catch (err: any) {
        if (err && typeof err === 'object' && (err as any).aborted) return
      }
    }
    // fallback base64
    const fr = new FileReader()
    fr.readAsDataURL(file)
    fr.onload = () => {
      props.editor?.chain().focus().updateAttributes('image', { src: fr.result }).run()
    }
  } finally {
    removeUploading(uploadId)
    input.value = ''
  }
}

function deleteSelectedImage() {
  if (!props.editor) return
  props.editor.chain().focus().deleteSelection().run()
}
</script>
