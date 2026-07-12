# Portfolio Codebase Audit & Action Plan

This document outlines the findings from the codebase audit, prioritized by severity. Check off items as they are resolved.

## 🔴 Critical — Fix First (Security & Core Functionality)

- [ ] **1. Secure Client-Side Admin Auth:** Remove hardcoded PIN hash and `sessionStorage` bypass in `AdminProvider.tsx`. Unify with server-side JWT+bcrypt system (`lib/admin/auth.ts`).
- [ ] **2. Remove Plaintext PIN Logging:** Remove `console.log` statements in `AdminProvider.tsx` that log the plaintext PIN and hash.
- [ ] **3. Implement Proper RBAC & Session Management:** Add scoped roles, audit logging, and proper session management instead of a single binary "admin" flag.
- [x] **4. Resolve Deployment Target Conflict:** Choose between Vercel Serverless (which supports API routes) or GitHub Pages (which requires a static export). Update `vercel.json`, `.github/workflows/deploy-prod.yml`, and `next.config.ts` accordingly.
- [x] **5. Implement Rate Limiting & Abuse Prevention:** Add rate limiting to `/api/admin/auth`, `/api/contact`, and GitHub proxy routes. Add CAPTCHA/Turnstile to the contact form.

## 🟠 High Priority (Reliability & Consistency)

- [x] **1. Implement Testing & CI Checks:** Write Playwright E2E tests (`.spec.ts` files). Add `npm run test:e2e`, `lint`, and `type-check` to the CI deployment pipeline.
- [x] **2. Fix Admin Save Functionality:** Update `allowedSections` in `/api/admin/portfolio` to include all 8 tabs (Blog, Microblog, Education, About, etc.) so saves actually persist to the server.
- [x] **3. Unify Content Stores:** Reconcile client-side `localStorage` (`portfolio_data_v1`) and the server-side KV store to prevent divergent state and missing conflict indicators.
- [ ] **4. Add Caching to GitHub API Routes:** Implement a shared caching layer (e.g., Redis/KV) for `/api/github/route.ts` to prevent rate limits on serverless cold starts.
- [x] **5. Optimize GitHub Review Route:** Refactor `/api/github-review` to remove redundant fetching and sequential processing. Add caching to improve multi-second response times.

## 🟡 Medium Priority (UI / UX / Functionality)

- [ ] **1. Improve Navigation:** Standardize on real routes or proper hash links. Fix `NEXT_PUBLIC_BASE_PATH` issues with hash links. Add active-tab persistence via URL for deep-linking.
- [x] **2. Consolidate Admin UIs:** Merge `AdminPanel.tsx` (drawer) and `/admin/page.tsx` (sidebar) into a single, cohesive experience. Add unsaved-changes warnings and version history/undo.
- [x] **3. Enhance Contact Form:** Add honeypot/spam fields. Verify and improve the UX of the `mailto:` fallback when EmailJS vars are missing.
- [ ] **4. Refine GitHub Review/Heatmap:** Use official GitHub APIs instead of scraping HTML for the heatmap. Label review scores as heuristics/estimates rather than quantitative metrics.
- [ ] **5. Add Guestbook Moderation:** If using Giscus, expose a clear reporting/moderation path for visitors.
- [x] **6. Add Schema Validation:** Implement server-side validation (e.g., Zod) for admin-submitted section data before persisting it to the KV store to prevent corruption.

## 🟢 Low Priority (Polish & Maintenance)

- [ ] **1. Accessibility Audit:** Test and improve keyboard navigation, focus traps, and `prefers-reduced-motion` for custom components and animations.
- [ ] **2. SEO Verification:** Ensure `NEXT_PUBLIC_BASE_PATH` doesn't leak into canonical URLs if deploying to GitHub Pages.
- [x] **3. Improve Type Safety:** Replace `any` casts in API routes (e.g., GitHub endpoints) with proper typed interfaces.
- [x] **4. Update Environment Variables Template:** Document `JWT_SECRET`, `ADMIN_PIN_HASH`, `GITHUB_TOKEN`, and `KV_REST_API_URL/TOKEN` in `.env.example`.
- [x] **5. Consolidate Documentation:** Merge overlapping markdown guides (`README`, `DEPLOYMENT_GUIDE`, `EDIT_GUIDE`, `GITHUB_PAGES_SETUP`, `GITHUB_SETUP`) based on the chosen deployment target.
