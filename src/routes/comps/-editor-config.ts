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
import { ImageNode } from './-image-node'

export const EDITOR_NODES = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  ImageNode,
]

export const EDITOR_THEME = {
  paragraph: 'editor-paragraph',
  heading: {
    h1: 'editor-h1',
    h2: 'editor-h2',
    h3: 'editor-h3',
    h4: 'editor-h3',
    h5: 'editor-h3',
    h6: 'editor-h3',
  },
  quote: 'editor-quote',
  link: 'editor-link',
  list: {
    ul: 'editor-ul',
    ol: 'editor-ol',
    listitem: 'editor-listitem',
    nested: { listitem: 'editor-nested-listitem' },
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'editor-underline-strike',
    code: 'editor-inline-code',
  },
}

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
