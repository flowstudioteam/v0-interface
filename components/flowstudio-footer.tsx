"use client"

import { siteConfig } from "@/lib/site-config"
import { trackCalendarClick, trackEvent } from "@/lib/use-tracker"

export default function FlowStudioFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      {/* CTA strip */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-xl">
            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase mb-4">
              Ready to begin?
            </p>
            <h2
              className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl md:text-7xl text-foreground leading-none mb-4 text-balance"
              style={{ letterSpacing: "0.02em" }}
            >
              Book a plant walkthrough
            </h2>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-md">
              We spend 30 minutes understanding your floor operations before we propose anything.
              No decks, no demos — just listening.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={siteConfig.calendarLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCalendarClick("footer_cta")}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent text-accent-foreground font-mono text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-80"
            >
              Schedule a call
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              onClick={() => trackEvent("email_click", { source: "footer_cta" })}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-border text-foreground font-mono text-xs tracking-[0.15em] uppercase transition-colors hover:border-accent hover:text-accent"
            >
              Email us
            </a>
          </div>
        </div>
      </div>

      {/* Main footer — simplified: brand, bio, and contact only */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {/* Brand + Bio */}
        <div>
          <span
            className="font-[family-name:var(--font-display)] text-2xl text-foreground tracking-widest block mb-4"
            style={{ letterSpacing: "0.1em" }}
          >
            flowstudio
          </span>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-md">
            We build and deploy AI systems for manufacturing SMBs in India, focused on real operational workflows instead of surface-level software layers. Our approach is deep vertical integration so AI can work inside the business, not just around it.
          </p>
        </div>

        {/* Contact */}
        <div className="md:text-right">
          <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-4">
            Contact
          </p>
          <ul className="space-y-3">
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                onClick={() => trackEvent("email_click", { source: "footer_contact" })}
                className="font-mono text-xs text-muted-foreground hover:text-accent transition-colors break-all"
              >
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/[^+\d]/g, "")}`}
                onClick={() => trackEvent("phone_click", { source: "footer_contact" })}
                className="font-mono text-xs text-muted-foreground hover:text-accent transition-colors"
              >
                {siteConfig.contact.phoneDisplay}
              </a>
            </li>
            <li className="pt-1">
              <a
                href={siteConfig.calendarLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCalendarClick("footer_contact")}
                className="font-mono text-xs text-accent hover:opacity-70 transition-opacity"
              >
                Book a meeting →
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
            &copy; {year} FlowStudio. All rights reserved.
          </p>
          <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
            India — Manufacturing AI
          </p>
        </div>
      </div>
    </footer>
  )
}
