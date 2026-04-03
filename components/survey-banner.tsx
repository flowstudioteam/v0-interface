"use client"

import { useState } from "react"

export function SurveyBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      role="banner"
      aria-label="Survey notice"
      className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between gap-4 border-b border-accent/30 bg-background/95 backdrop-blur-sm px-4 md:px-6 py-2.5"
      style={{ borderTop: "2px solid oklch(0.7 0.2 45)" }}
    >
      {/* Left — pulsing dot + label */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="relative flex shrink-0 h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>

        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent font-medium whitespace-nowrap">
          Survey by flowstudio.co.in
        </span>

        {/* Divider — hidden on very small screens */}
        <span className="hidden sm:block text-border/60 font-mono text-xs select-none">·</span>

        <p className="hidden sm:block font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate">
          Industry research on AI adoption in Indian manufacturing — not the official website
        </p>
      </div>

      {/* Right — main site link + dismiss */}
      <div className="flex shrink-0 items-center gap-3 md:gap-5">
        <a
          href="https://flowstudio.co.in"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit the official FlowStudio website at flowstudio.co.in"
          className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors duration-150"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
            className="shrink-0 opacity-50 group-hover:opacity-100 transition-opacity"
          >
            <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>flowstudio.co.in</span>
        </a>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss survey notice"
          className="flex items-center justify-center w-5 h-5 text-muted-foreground/50 hover:text-foreground transition-colors duration-150"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
