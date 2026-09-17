## Goal Description

The goal is to enhance the existing raw Lexical editor by introducing an advanced UI architecture inspired by Payload CMS. We will implement and organize UI toolbars and floating menus into specific feature directories. This includes:

1. **Fixed Toolbar**: A persistent toolbar at the top of the editor for formatting and block insertion.
2. **Inline Toolbar**: A contextual, floating toolbar that appears when text is selected.
3. **Slash Menu**: A typeahead popover triggered by typing `/` for quick block insertion.
4. **Block Handles**: Drag-and-drop handles and quick add buttons (`+` icon) anchored to the active block.

## User Review Required

> [!IMPORTANT]
> **Directory Structure**: The plan proposes creating `src/features/...` and `src/lexical/...` directories at the project root. This means moving or referencing Lexical-related files outside of the current `src/routes/comps/editor-workspace/lexical` path.
>
> Should we move _all_ Lexical configuration and plugins from the `routes` directory into `src/lexical` to keep the architecture clean and centralized, or just keep the new plugins there while the editor remains in `routes`?

## Proposed Changes

### 1. Fixed Toolbar (`src/features/toolbars/fixed/client`)

We will refactor the existing `EditorToolbar` into the new feature directory.

#### [NEW] `src/features/toolbars/fixed/client/index.tsx`

This will contain the `FixedToolbar` logic, migrated from the existing `EditorToolbar`. It will use `useLexicalComposerContext()` to dispatch commands for text formatting (bold, italic) and block formatting (paragraphs, headings).

#### [DELETE] `src/routes/comps/editor-workspace/lexical/-editor-toolbar.tsx`

Remove the old toolbar file.

### 2. Inline Toolbar (`src/features/toolbars/inline/client`)

We will create a floating toolbar that listens to selection changes.

#### [NEW] `src/features/toolbars/inline/client/index.tsx`

A React portal component that listens to the `SELECTION_CHANGE_COMMAND`. When text is highlighted, it calculates the DOM coordinates of the selection and renders a floating toolbar with options like Bold, Italic, and Link directly above the selection.

### 3. Slash Menu (`src/lexical/plugins/SlashMenu`)

We will add a typeahead popover for quick block insertion.

#### [NEW] `src/lexical/plugins/SlashMenu/index.tsx`

This plugin will utilize `@lexical/react/LexicalTypeaheadMenuPlugin`. It will define `/` as the trigger and provide options like Heading 2, Heading 3, Quote, and List. When an option is selected, it will replace the slash text and insert the corresponding block.

### 4. Block Handles (`src/lexical/plugins/handles`)

We will implement floating action buttons to manipulate blocks.

#### [NEW] `src/lexical/plugins/handles/DraggableBlockPlugin.tsx`

A plugin that adds a drag-and-drop grip handle to the left of the hovered/active block. It will use `@lexical/utils` or a custom portal logic to handle the node movement and positioning.

#### [NEW] `src/lexical/plugins/handles/AddBlockHandlePlugin.tsx`

A plugin that adds a `+` icon next to blocks to quickly open an insertion menu (or simply insert a new paragraph below).

### 5. Editor Orchestration

We need to update the main editor component to register all these new plugins.

#### [MODIFY] `src/routes/comps/editor-workspace/lexical/-rich-text-editor.tsx`

We will import and mount the `FixedToolbar`, `InlineToolbar`, `SlashMenu`, `DraggableBlockPlugin`, and `AddBlockHandlePlugin` inside the `LexicalComposer`.

```tsx
// Example pseudo-code of what will be added
import { FixedToolbar } from '@/features/toolbars/fixed/client'
import { InlineToolbar } from '@/features/toolbars/inline/client'
import { SlashMenu } from '@/lexical/plugins/SlashMenu'
import { DraggableBlockPlugin } from '@/lexical/plugins/handles/DraggableBlockPlugin'
import { AddBlockHandlePlugin } from '@/lexical/plugins/handles/AddBlockHandlePlugin'

// Inside LexicalComposer:
<FixedToolbar />
{/* Editor ContentEditable... */}
<InlineToolbar />
<SlashMenu />
<DraggableBlockPlugin />
<AddBlockHandlePlugin />
```

## Verification Plan

### Manual Verification

1. **Fixed Toolbar**: Open the editor and verify the Fixed Toolbar is visible at the top and its buttons (bold, italic, headings) work correctly.
2. **Inline Toolbar**: Highlight some text and verify the Inline Toolbar appears just above the selection and applies formatting.
3. **Slash Menu**: Type `/` on a new line and verify the Slash Menu popover appears. Select an item to verify it inserts correctly.
4. **Block Handles**: Hover over a block and verify the Block Handles (drag grip and `+` button) appear. Try dragging a block to a new position.
