import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical'
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingNode,
  QuoteNode,
} from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { LinkNode } from '@lexical/link'
import { STARTER_BLOCKS } from './-editor-data'
import { ImageNode } from '../lexical/-image-node'
import { EDITOR_TYPOGRAPHY } from './-editor-typography'

export const EDITOR_NODES = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  ImageNode,
]

export const EDITOR_THEME = EDITOR_TYPOGRAPHY

export function $createStarterDocument() {
  const root = $getRoot()
  if (!root.isEmpty()) return
  for (const block of STARTER_BLOCKS) {
    const node =
      block.type === 'h2'
        ? $createHeadingNode('h2')
        : block.type === 'quote'
          ? $createQuoteNode()
          : $createParagraphNode()
    root.append(node.append($createTextNode(block.text)))
  }
}
