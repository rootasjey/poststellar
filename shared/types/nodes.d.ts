import type { Node } from '@tiptap/pm/model';
import type { Selection } from '@tiptap/pm/state'

export interface BlockType {
  label: string;
  icon: string;
  isActive: () => boolean | undefined;
  action: () => void | Promise<void> | boolean;
}

export interface BetterSelection extends Selection {
  node?: Node
}
