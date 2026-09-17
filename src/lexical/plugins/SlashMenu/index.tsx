import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical'
import type { TextNode } from 'lexical'

class SlashMenuOption extends MenuOption {
  title: string
  iconString: string
  onSelect: () => void

  constructor(
    title: string,
    iconString: string,
    options: { onSelect: () => void },
  ) {
    super(title)
    this.title = title
    this.iconString = iconString
    this.onSelect = options.onSelect
  }
}

export function SlashMenu() {
  const [editor] = useLexicalComposerContext()
  const [, setQueryString] = useState<string | null>(null)

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  })

  const options = [
    new SlashMenuOption('Heading 2', 'H2', {
      onSelect: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h2'))
          }
        })
      },
    }),
    new SlashMenuOption('Heading 3', 'H3', {
      onSelect: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode('h3'))
          }
        })
      },
    }),
    new SlashMenuOption('Paragraph', 'P', {
      onSelect: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode())
          }
        })
      },
    }),
    new SlashMenuOption('Quote', 'Q', {
      onSelect: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode())
          }
        })
      },
    }),
    new SlashMenuOption('Bullet List', 'BL', {
      onSelect: () => {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
      },
    }),
    new SlashMenuOption('Numbered List', 'NL', {
      onSelect: () => {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
      },
    }),
  ]

  const onSelectOption = useCallback(
    (
      selectedOption: SlashMenuOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        if (nodeToRemove) {
          nodeToRemove.remove()
        }
        selectedOption.onSelect()
      })
      closeMenu()
    },
    [editor],
  )

  return (
    <LexicalTypeaheadMenuPlugin<SlashMenuOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) => {
        if (anchorElementRef.current == null || options.length === 0) {
          return null
        }
        return createPortal(
          <div className="z-50 mt-1 w-48 rounded-md border border-[#3c3c3c] bg-background shadow-md overflow-hidden">
            <ul className="py-1">
              {options.map((option, i) => (
                <li
                  key={option.key}
                  tabIndex={-1}
                  className={`flex cursor-pointer items-center px-4 py-2 text-sm text-foreground hover:bg-muted ${
                    selectedIndex === i ? 'bg-muted' : ''
                  }`}
                  ref={(el) => {
                    if (el && selectedIndex === i) {
                      el.scrollIntoView({ block: 'nearest' })
                    }
                  }}
                  onMouseEnter={() => {
                    setHighlightedIndex(i)
                  }}
                  onClick={() => {
                    setHighlightedIndex(i)
                    selectOptionAndCleanUp(option)
                  }}
                >
                  <span className="mr-3 text-xs font-bold text-muted-foreground w-6 text-center">
                    {option.iconString}
                  </span>
                  {option.title}
                </li>
              ))}
            </ul>
          </div>,
          anchorElementRef.current,
        )
      }}
    />
  )
}
