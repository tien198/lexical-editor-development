## Goal Description

The goal is to enhance the existing raw Lexical editor by introducing an advanced UI architecture inspired by Payload CMS. We will implement and organize UI toolbars and floating menus into specific feature directories. This includes:

1. **Fixed Toolbar**: A persistent toolbar at the top of the editor for formatting and block insertion.
2. **Inline Toolbar**: A contextual, floating toolbar that appears when text is selected.
3. **Slash Menu**: A typeahead popover triggered by typing `/` for quick block insertion.
4. **Block Handles**: Drag-and-drop handles and quick add buttons (`+` icon) anchored to the active block.

We will import and mount the `FixedToolbar`, `InlineToolbar`, `SlashMenu`, `DraggableBlockPlugin`, and `AddBlockHandlePlugin` inside the `LexicalComposer`.

### Manual Verification

1. **Fixed Toolbar**: Open the editor and verify the Fixed Toolbar is visible at the top and its buttons (bold, italic, headings) work correctly.
2. **Inline Toolbar**: Highlight some text and verify the Inline Toolbar appears just above the selection and applies formatting.
3. **Slash Menu**: Type `/` on a new line and verify the Slash Menu popover appears. Select an item to verify it inserts correctly.
4. **Block Handles**: Hover over a block and verify the Block Handles (drag grip and `+` button) appear. Try dragging a block to a new position.

### 2. What constitutes "Over-engineering"?

The part of the Payload CMS architecture that might be over-engineering for you right now is the **Dynamic Orchestrator**.

Payload has a complex system where it reads a configuration object, figures out which plugins are enabled, and dynamically injects them into specific anchor points in the UI (e.g., `aboveContainer`, `floatingAnchorElem`). They _have_ to do this because they are a CMS and their users configure the editor dynamically.

### 3. How to start simple and scale later

Right now, you can just hardcode your features directly into your `RichTextEditor` component:

```tsx
// Example pseudo-code of what will be added
import { FixedToolbar } from '@/features/toolbars/fixed/client'
import { InlineToolbar } from '@/features/toolbars/inline/client'
import { SlashMenu } from '@/lexical/plugins/SlashMenu'
import { DraggableBlockPlugin } from '@/lexical/plugins/handles/DraggableBlockPlugin'
import { AddBlockHandlePlugin } from '@/lexical/plugins/handles/AddBlockHandlePlugin'

<LexicalComposer initialConfig={...}>
    {/* Editor ContentEditable... */}
    <FixedToolbar />      {/* Hardcoded */}
    <RichTextPlugin />
    <InlineToolbar />     {/* Hardcoded */}
    <SlashMenu />         {/* Hardcoded */}
</LexicalComposer>
```

**If you decide you need a dynamic plugin registry later:**
All you will have to do is change `RichTextEditor.tsx` to map over an array of configurations instead of hardcoding the components:

```tsx
<LexicalComposer initialConfig={...}>
  {activePlugins.map(Plugin => <Plugin key={Plugin.id} />)}
</LexicalComposer>
```

You won't have to rewrite the `FixedToolbar`, `InlineToolbar`, or `SlashMenu` components at all.
