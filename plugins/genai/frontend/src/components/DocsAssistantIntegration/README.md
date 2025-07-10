# DocsAssistantIntegration

The `DocsAssistantIntegration` component provides a flexible way to integrate the GenAI Documentation Assistant into Backstage TechDocs pages. The component automatically detects when the user is on a TechDocs page and provides an AI assistant that has context about the current documentation.

## Features

- **Automatic Context Detection**: Uses `useTechDocsContext` to automatically detect TechDocs pages and extract document context
- **Hidden Context Passing**: Sends document context (entity reference and document path) to the LLM without showing it in the chat UI
- **Multiple UI Variants**: Supports different positioning and styling options
- **Clean Modal Interface**: Provides a resizable modal with full chat functionality

## UI Variants

### 1. Sticky (`variant="sticky"`) - Default

- **Position**: Fixed to the right edge of the screen, vertically centered
- **Appearance**: Circular button with rounded left edge
- **Behavior**: Always visible, doesn't interfere with content
- **Best for**: Most use cases, unobtrusive access

### 2. Toolbar (`variant="toolbar"`)

- **Position**: Fixed in the top-right area, below the main Backstage header
- **Appearance**: Small toolbar with border and background
- **Behavior**: Positioned to integrate with page content
- **Best for**: When you want a more integrated look

### 3. Chip (`variant="chip"`)

- **Position**: Fixed in the bottom-right corner
- **Appearance**: Material-UI Chip with "Ask AI" label
- **Behavior**: More prominent call-to-action
- **Best for**: When you want to encourage assistant usage

### 4. Top Bar (`variant="topbar"`)

- **Position**: Fixed bar across the top of the content area
- **Appearance**: Full-width bar with background color
- **Behavior**: Most prominent, spans entire width
- **Best for**: When assistant is a primary feature

## Usage

```tsx
import { DocsAssistantIntegration } from '@aws/genai-plugin-for-backstage';

// Default sticky variant
<DocsAssistantIntegration />

// Specific variant
<DocsAssistantIntegration variant="chip" />
```

## App-Level Integration

Add the assistant globally to your Backstage app:

```tsx
// packages/app/src/App.tsx
import { DocsAssistantIntegration } from '@aws/genai-plugin-for-backstage';

export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
      
      {/* Add the docs assistant - only appears on TechDocs pages */}
      <DocsAssistantIntegration variant="sticky" />
    </AppRouter>
  </>,
);
```

## Context Handling

The component automatically:

1. Detects if the current page is a TechDocs page
2. Extracts the entity reference (e.g., "Component:default/my-service")
3. Extracts the document path (e.g., "getting-started")
4. Passes this context to the LLM as hidden context
5. Shows only the user's actual message in the chat UI

The LLM receives a message like:

```text
Current context: I'm viewing documentation for "Component:default/my-service" at path "getting-started".

Question: How do I deploy this service?
```

But the user only sees:

```text
How do I deploy this service?
```

## Dependencies

- `useTechDocsContext`: For detecting TechDocs pages and extracting context
- `DocsChatModal`: For the modal chat interface
- `@material-ui/core`: For UI components
- `@backstage/core-components`: For ChatIcon
