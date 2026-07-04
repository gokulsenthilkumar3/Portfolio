# Gokul S — Portfolio

Personal portfolio of **Gokul Senthilkumar** ([@gokulsenthilkumar3](https://github.com/gokulsenthilkumar3)) — SDET & Full-Stack Developer from Tamil Nadu, India.

🌐 **Live:** [portfolio-ten-plum-98.vercel.app](https://portfolio-ten-plum-98.vercel.app)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| 3D | React Three Fiber / Three.js |
| State | Zustand |
| Icons | Lucide React |
| Deploy | Vercel |

---

## Features

- **Hero** — 3D animated background, text reveal effects
- **About** — interactive timeline, animated stats counter
- **Skills** — 2D/3D toggle, category filtering, proficiency bars
- **Projects** — searchable/filterable gallery with detail views
- **GitHub** — live API stats, contribution heatmap, Commit City mini-game
- **Insights** — blog/articles section
- **Contact** — validated form with toast feedback
- **Theme System** — Dark, Light, Neon, Pastel, Cyberpunk with live switching
- **Accessibility** — WCAG 2.1 AA, keyboard nav, `prefers-reduced-motion` support

---

## Project Structure

```
src/
├── app/
│   ├── api/github/       # GitHub stats API route (5-min cached)
│   ├── (sections)/       # Route groups
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── effects/          # LiquidTransitions, MagneticButton, etc.
│   ├── shared/           # Navigation, Footer, GitHubSection, etc.
│   └── ui/               # Base UI primitives
├── hooks/                # use3DGate
├── lib/
│   ├── data/content.ts   # All site content
│   ├── hooks/            # useMousePosition, useTheme, useParallax
│   └── utils/
├── config/
│   └── portfolio.config.ts  # ← Edit this to personalise
└── styles/globals.css
```

---

## Personalisation

Edit **one file**: `src/config/portfolio.config.ts`

```ts
personal: {
  name: 'Your Name',
  title: 'Your Title',
  email: 'you@example.com',
  github: 'https://github.com/you',
}
```

All sections (projects, skills, experience, social links, SEO) are driven from this single config. See inline comments for guidance.

---

## Local Development

```bash
git clone https://github.com/gokulsenthilkumar3/Portfolio.git
cd Portfolio
npm install
npm run dev          # → http://localhost:3000
```

### Environment Variables

Create `.env.local`:

```env
GITHUB_TOKEN=ghp_your_token   # Optional — raises GitHub API rate limit
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Deployment

```bash
npm run build   # Verify no build errors locally
vercel          # Deploy to Vercel
```

---

## License

MIT — see [LICENSE](LICENSE).
