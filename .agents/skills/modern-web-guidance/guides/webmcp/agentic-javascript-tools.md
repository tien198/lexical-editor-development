# Agentic JavaScript Tools

The Imperative API uses `document.modelContext.registerTool()` to programmatically define JavaScript tools. This is ideal for Single Page Applications (SPAs) where tools need to be added or removed based on the current route or user state.

## Registration and Lifecycle

Tools are registered by passing a tool definition object and an optional options object containing an `AbortSignal`.

### Lifecycle Handling with `AbortController`

WebMCP does not provide an `unregisterTool()` method. To unregister a tool, you must pass an `AbortSignal` during registration and abort that signal when the tool is no longer needed.

```javascript
<<<<<<< HEAD
const controller = new AbortController();

await document.modelContext.registerTool({
  name: "get_user_preferences",
  description: "Retrieves the user's saved preferences.",
  inputSchema: { type: "object", properties: {} },
  execute() {
    const prefs = localStorage.getItem("user_prefs");
    return prefs ? JSON.parse(prefs) : { theme: "light" };
  },
  annotations: { readOnlyHint: true }
}, { signal: controller.signal });

// To unregister the tool (e.g., on component unmount):
controller.abort();
=======
const controller = new AbortController()

await document.modelContext.registerTool(
  {
    name: 'get_user_preferences',
    description: "Retrieves the user's saved preferences.",
    inputSchema: { type: 'object', properties: {} },
    execute() {
      const prefs = localStorage.getItem('user_prefs')
      return prefs ? JSON.parse(prefs) : { theme: 'light' }
    },
    annotations: { readOnlyHint: true },
  },
  { signal: controller.signal },
)

// To unregister the tool (e.g., on component unmount):
controller.abort()
>>>>>>> 4cfe05b (edit ImageUpload)
```

## Defining Parameters

Parameters (params) are defined using the `inputSchema` property. This must be a **JSON Schema** object that describes the structured data the tool expects.

```javascript
await document.modelContext.registerTool({
<<<<<<< HEAD
  name: "calculate_area",
  description: "Calculates the area of a rectangle.",
  inputSchema: {
    type: "object",
    properties: {
      width: { type: "number", description: "The width of the rectangle." },
      height: { type: "number", description: "The height of the rectangle." }
    },
    required: ["width", "height"]
  },
  execute(input) {
    // input is { width: 10, height: 20 }
    return input.width * input.height;
  },
  annotations: { readOnlyHint: true }
});
=======
  name: 'calculate_area',
  description: 'Calculates the area of a rectangle.',
  inputSchema: {
    type: 'object',
    properties: {
      width: { type: 'number', description: 'The width of the rectangle.' },
      height: { type: 'number', description: 'The height of the rectangle.' },
    },
    required: ['width', 'height'],
  },
  execute(input) {
    // input is { width: 10, height: 20 }
    return input.width * input.height
  },
  annotations: { readOnlyHint: true },
})
>>>>>>> 4cfe05b (edit ImageUpload)
```

## Execution Patterns

### When to use `async execute`

<<<<<<< HEAD
Use `async` when the tool involves operations that return a Promise or take time to complete:
=======

Use `async` when the tool involves operations that return a Promise or take time to complete:

> > > > > > > 4cfe05b (edit ImageUpload)

- **Network calls**: Fetching data from an API.
- **Asynchronous Storage**: Accessing IndexedDB.
- **External Events**: Waiting for a specific state change or animation to finish.

```javascript
async execute(input) {
  const response = await fetch(`/api/data/${input.id}`);
  return await response.json();
}
```

### When to use `execute` (Synchronous)

<<<<<<< HEAD
Use a standard synchronous function for immediate operations:
=======

Use a standard synchronous function for immediate operations:

> > > > > > > 4cfe05b (edit ImageUpload)

- **Pure logic**: Math, filtering, or sorting data already in memory.
- **Synchronous state**: Reading from `localStorage` or a synchronous state manager.

```javascript
execute(input) {
  return input.items.filter(item => item.active);
}
```

## Tool Factory Pattern

To pass context (like stores or application instances) to your tools, use factory functions.

```javascript
export function createInventoryTool(inventoryManager) {
  return {
<<<<<<< HEAD
    name: "get_inventory",
    description: "Lists items in the inventory.",
    inputSchema: { type: "object", properties: {} },
    execute() {
      return inventoryManager.getItems();
    },
    annotations: { readOnlyHint: true }
  };
=======
    name: 'get_inventory',
    description: 'Lists items in the inventory.',
    inputSchema: { type: 'object', properties: {} },
    execute() {
      return inventoryManager.getItems()
    },
    annotations: { readOnlyHint: true },
  }
>>>>>>> 4cfe05b (edit ImageUpload)
}
```

## API Notes

<<<<<<< HEAD

- **annotations**: (Optional) A dictionary for tool metadata.
  - **readOnlyHint**: (Optional) Set to `true` if the tool does not modify any state and only reads data. This helps agents decide when it is safe to call the tool.
- **Return Format**: The `execute` function can return any value (object, array, string, number, boolean). Select a structure that best serves your specific use case while ensuring the content is optimized for the LLM to process. The output may encompass raw data, specific error logs, or direct instructions to influence the agent's next action.
- **Secure Context**: WebMCP requires HTTPS.
- **Deprecated/Removed**: `navigator.modelContext` (deprecated in Chromium 150), `unregisterTool()`, `provideContext()`, and `clearContext()` are no longer supported.
  \=======

* **annotations**: (Optional) A dictionary for tool metadata.
  - **readOnlyHint**: (Optional) Set to `true` if the tool does not modify any state and only reads data. This helps agents decide when it is safe to call the tool.
* **Return Format**: The `execute` function can return any value (object, array, string, number, boolean). Select a structure that best serves your specific use case while ensuring the content is optimized for the LLM to process. The output may encompass raw data, specific error logs, or direct instructions to influence the agent's next action.
* **Secure Context**: WebMCP requires HTTPS.
* **Deprecated/Removed**: `navigator.modelContext` (deprecated in Chromium 150), `unregisterTool()`, `provideContext()`, and `clearContext()` are no longer supported.

> > > > > > > 4cfe05b (edit ImageUpload)

## Fallback strategies

document.modelContext is not natively supported by any major browser yet.

The WebMCP Imperative API should be used with feature detection to ensure compatibility with browsers that do not yet support WebMCP.

```javascript
<<<<<<< HEAD
const modelContext = document.modelContext || navigator.modelContext;
=======
const modelContext = document.modelContext || navigator.modelContext
>>>>>>> 4cfe05b (edit ImageUpload)
if (modelContext && 'registerTool' in modelContext) {
  // Register tools
}
```
