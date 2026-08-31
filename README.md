# Gokul Senthilkumar — Portfolio

Personal portfolio for Gokul Senthilkumar, a Software Development Engineer in Test and full-stack developer.

## Stack

- Next.js 16 App Router and React 19
- TypeScript, Tailwind CSS, and CSS tokens
- GSAP, Framer Motion, Lenis, and a capability-gated Three.js hero
- Protected admin editor with server-side PIN/JWT authentication

## What is included

- A focused hero that explains the SDET/full-stack practice in one read.
- Selected work cards with detail dialogs, source links, and progressive-motion fallbacks.
- Profile timeline using curated achievements and the earliest career start.
- About portrait and verified profile metrics.
- Skills category filters with accessible announcements and pause/play control.
- Direct email/social contact and a keyboard-friendly mobile navigation.
- `/admin` authentication gate and one responsive editor drawer for private drafts.

The public page treats `src/config/portfolio.config.ts` as its source of truth. External GitHub and LinkedIn integrations are optional admin-side tools and never rewrite the public copy automatically.

## Project structure

```text
src/
├── app/                    # Public page, admin gate, and API routes
├── components/
│   ├── admin/              # Authenticated editor and draft persistence
│   ├── portfolio/          # Hero, work, skills, about, and contact sections
│   ├── shared/             # Navigation, profile, theme, and route chrome
│   └── ui/                 # Reusable controls
├── config/portfolio.config.ts
├── lib/                    # Auth, storage, hooks, and content helpers
└── styles/                 # Public cinematic design system
```

## Local development

```bash
npm install
npm run dev                 # http://localhost:3000
npm run type-check
npm run build
npm run test:e2e
```

If `npm` is unavailable in a managed environment, run the equivalent scripts with the bundled Node runtime and the binaries in `node_modules`.

### Environment variables

```env
ADMIN_PIN_HASH=             # bcrypt hash for the private editor PIN
JWT_SECRET=                 # long random secret for the admin session cookie
GITHUB_TOKEN=               # optional, raises GitHub API rate limits
GITHUB_USERNAME=gokulsenthilkumar3
LINKEDIN_ACCESS_TOKEN=      # optional approved LinkedIn token
EMAILJS_SERVICE_ID=         # optional contact delivery
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=
KV_REST_API_URL=            # required for durable production drafts
KV_REST_API_TOKEN=
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

The curated profile remains usable when optional integrations are not configured. Durable publishing requires the KV credentials shown above.

## Deployment

Run the type check, production build, and end-to-end suite before publishing. The repository is configured for the Sites hosting workflow; keep `.openai/hosting.json` in place so the project is published with its configured project ID.

See [AUDIT.md](AUDIT.md) for the latest verified audit and known follow-ups.

## License

MIT — see [LICENSE](LICENSE).
