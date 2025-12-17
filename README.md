# App Graph Builder

A responsive App Graph Builder UI built with React, Vite, TypeScript, ReactFlow, and shadcn/ui.

## Features

- **Responsive Layout**: Top bar, left rail, and a right panel that becomes a drawer on small screens.
- **App Selection**: Select apps to load specific graph topologies (mocked).
- **Interactive Graph**: 
  - Drag, select, and delete nodes.
  - Zoom and Pan.
  - Automatic layout on load.
- **Node Inspector**: 
  - Select a node to view its details.
  - Edit node name (synced to graph).
  - Adjust replicas using slider or input (synced).
  - View status status through badges.
- **Data Fetching**: Powered by TanStack Query and Mock Service Worker (MSW).
- **State Management**: minimal local state with Zustand for UI coordination.

## Development

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Key Scripts

- `npm run dev`: Start dev server.
- `npm run build`: Build for production.
- `npm run typecheck`: Check TypeScript types.
- `npm run lint`: Run ESLint.
- `npm run preview`: Preview build.

## Key Decisions

- **ReactFlow Integrated State**: We used `useNodesState` and `useEdgesState` lifted to the page level to allow both the Canvas (visual manipulation) and the Inspector (form manipulation) to operate on the same data source seamlessly.
- **MSW for Mocking**: Mock Service Worker intercepts requests to `/api/apps` and `/api/apps/:id/graph`, providing a realistic data fetching experience without a real backend.
- **Zustand for UI**: Used exclusively for cross-component UI state like the selected app/node IDs and mobile drawer state, keeping the data flow clean.
- **Styling**: TailwindCSS v3 + shadcn/ui components for a premium, consistent look.

## Known Limitations

- The "Add Node" feature is not implemented (Bonus).
- Edges are currently simple connections; complex custom edges are not implemented.
- Persistence is local to the session (refreshing resets to mock data).
