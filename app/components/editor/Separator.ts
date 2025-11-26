import { Node, mergeAttributes, type RawCommands } from '@tiptap/core'

export interface SeparatorOptions {
  HTMLAttributes: Record<string, any>
}

export const Separator = Node.create<SeparatorOptions>({
  name: 'separator',

  group: 'block',
  atom: true,

  addAttributes() {
    return {
      dashed: { default: false },
    }
  },

  parseHTML() {
    return [
      { tag: 'hr' },
      { tag: 'div[data-type="separator"]' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(HTMLAttributes)
    // Keep markup minimal – prefer real <hr> for semantics and styling
    if (attrs.dashed === true || attrs.dashed === 'true') {
      return ['hr', { ...attrs, class: `${attrs.class ?? ''} separator separator--dashed`.trim() }]
    }
    return ['hr', { ...attrs, class: `${attrs.class ?? ''} separator`.trim() }]
  },

  addCommands() {
    return {
      insertSeparator: () => ({ commands }: { commands: RawCommands }) => {
        return commands.insertContent({ type: this.name })
      },
      insertDashedSeparator: () => ({ commands }: { commands: RawCommands }) => {
        return commands.insertContent({ type: this.name, attrs: { dashed: true } })
      },
    } as Partial<RawCommands>
  },
})

export default Separator
