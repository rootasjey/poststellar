import Image from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageNodeView from '~~/app/components/editor/ImageNodeView.vue'

export const CustomImage = Image.extend({
  name: 'image',

  addAttributes() {
    // `parent` isn't exposed on the public typings so guard it via `any`.
    const parentAttrs = (this as any).parent?.() ?? {}
    return {
      ...parentAttrs,
      src: { default: null },
      alt: { default: '' },
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageNodeView)
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    // Figure with caption (static rendering). Alt shown as caption if present.
    const { alt, ...rest } = HTMLAttributes as any
    return ['figure', { class: 'image-figure' }, ['img', { ...rest, alt }], ['figcaption', { class: 'image-caption' }, alt || '']]
  },
})

export default CustomImage
