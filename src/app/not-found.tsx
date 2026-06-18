import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found | Gokul S',
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* Big 404 */}
      <div className="relative mb-8 select-none">
        <span
          className="text-[10rem] md:text-[14rem] font-black font-display leading-none
                     text-transparent bg-clip-text
                     bg-gradient-to-b from-primary/30 via-primary/10 to-transparent"
        >
          404
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-[10rem] md:text-[14rem] font-black font-display leading-none text-primary/5 blur-2xl">
          404
        </span>
      </div>

      {/* Message */}
      <h1 className="text-2xl md:text-3xl font-bold font-display mb-3">
        Page not found
      </h1>
      <p className="text-muted-foreground max-w-sm mb-10 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      {/* Quick links */}
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          ← Go Home
        </Link>
        <Link
          href="/#projects"
          className="px-5 py-2.5 rounded-xl border border-border/60 bg-card/40 text-sm font-semibold hover:bg-card/70 transition-colors"
        >
          View Projects
        </Link>
        <Link
          href="/contact"
          className="px-5 py-2.5 rounded-xl border border-border/60 bg-card/40 text-sm font-semibold hover:bg-card/70 transition-colors"
        >
          Contact Me
        </Link>
      </div>
    </main>
  )
}
