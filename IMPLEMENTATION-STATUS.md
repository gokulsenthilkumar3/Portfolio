# Portfolio implementation status

Updated 2026-11-08. This records implementation and verification separately from the static review in PROJECT-ANALYSIS.md.

## Implemented

- Contact form with validation, honeypot, sending state, error recovery and success feedback.
- Tour/Browse project views, text search and category filters.
- Public blog and Markdown articles, short notes, RSS, sitemap entries.
- Guestbook with opt-in GitHub comments and a separately loaded 3D sculpture.
- Now, Uses and printable Resume pages, including the existing profile photo.
- Footer navigation, social links and searchable keyboard command palette.
- Languages and conditional, CMS-backed recommendations and scheduling CTA.
- Case-study breadcrumbs, contents, reading progress, previous/next projects and generated social images.
- Slower project tour, persistent primary navigation, mobile form layout and reduced-motion support.
- Locally hosted Satoshi fonts, removing external font CSS requests. Font files originate from Fontshare's Satoshi stylesheet.
- Extras editor tab, additional personal fields, server/client draft validation and ordered draft writes.
- Stale browser publication rejection; request-local memoization of published content.
- PIN length alignment, fail-closed authentication limiting during KV failures, cross-site admin request rejection, security headers and preserved production error logs.
- Corrected download mappings, truthful stats-source labels, experience description bullets and unique new blog slugs.
- Modern TypeScript target and a GitHub Actions check workflow.

## Owner content / external verification

- Add genuine recommendations and an HTTPS scheduling URL in Admin → Pages.
- Publish real blog content; the public listing currently shows an empty state.
- Supply new product screenshots and measured outcomes when available; existing captions retain concept/prototype provenance.
- EmailJS delivery and GitHub Discussions permissions require external-service verification. Browser contact tests mock delivery and send no actual email.
- Downloads show actual GitHub release availability; a downloadable build must exist upstream.

## Broader analysis work still outstanding

PROJECT-ANALYSIS.md also proposes work beyond the original portfolio feature list. Those items are not all complete:

- Full cross-device draft versioning, atomic concurrent writes, discard/revert and publish history.
- Consistent debounced or explicit-save editing across every editor, with nested-dialog accessibility review.
- JWT revocation/session management and full CSP resource restrictions.
- Bundle/Lighthouse budgets and analytics funnel instrumentation. The Graphify-guided unused-source cleanup is complete; see ARCHITECTURE.md.
- Repository quality dashboard, newsletter, tailored server PDF, live CI dashboard and other proposed product features.

Existing authentication libraries were retained. Replacing established PIN hashing merely to reduce dependency weight would require migration planning.
