# Portfolio architecture

## Runtime boundaries

Next.js routes and the root layout read published content through src/lib/server/portfolio.ts. This repository memoizes reads within a request and delegates persistence to src/lib/admin/storage.ts. Shared baseline merging and Zod validation live in src/lib/portfolio-content.ts; baseline content lives in src/config/portfolio.config.ts.

Public client components use AdminProvider for the published preview and authenticated draft editing. Draft and publish requests go through authenticated /api/admin handlers. Client modules must not import server repositories, authentication or storage.

## Module responsibilities

- src/app: framework entry points, metadata and HTTP responses.
- src/components/portfolio: portfolio experiences and project browsing.
- src/components/shared: navigation, comments, reading and print controls.
- src/components/admin: editor UI and browser state.
- src/lib/server: server-side published-content reads.
- src/lib/admin: authentication, rate limiting and persistence.
- src/config and src/lib/types: baseline content and shared contracts.
- src/styles: visual tokens and responsive behavior.

The supported appearance is dark with gold accents. CSS applies theme tokens at first paint; no persisted theme store or runtime theme provider is required.

## Maintenance checks

Run npm run check:architecture to check source reachability from Next.js entry points, unresolved local imports, import cycles and client/server boundaries. It uses TypeScript's parser and module resolver, including static dynamic imports. CI runs this check.

The checker includes type imports and cannot discover computed module paths, external API consumers or CSS references. Framework routes are roots even when no component imports them.

Graphify provides the broader symbol/dependency map. From the repository root, run graphify extract . --code-only --force --out . followed by graphify cluster-only . --no-label. Query the result with graphify query "getPublishedPortfolio AdminProvider storage" --budget 2000.

Graphify's code-only scan excludes image/document semantics and CSS. Its graph guides navigation; import searches, route conventions and verification determine whether code is removable.

The final graph contains three self-loop call edges in the recursive scan, walk and cycles functions of scripts/check-architecture.mjs. These represent intentional recursion, not module import cycles. There are no missing or dangling endpoints.

Generated Graphify data and the local cleanup recovery archive are ignored by Git and ESLint. Archived source is at .cleanup-archive/removed-source.json. Existing staged changes were preserved.

## Removed legacy surface

Unused GitHub profile/project sync, LinkedIn sync and repository-scoring API routes were removed. Public portfolio content, GitHub stats, downloads, contact and admin routes remain.

Unused theme stores, duplicate device-tier hooks, UI wrappers and helper barrels were removed after import checks. ProjectBrowser, use3DGate, the guestbook scene and CMS editors remain active.

Direct dependencies removed: @react-three/postprocessing, three-custom-shader-material, class-variance-authority and zustand. Some packages may remain transitively required.

Next.js and the existing Vinext/Sites build configuration are retained because Vite configuration and npm scripts reference them.
