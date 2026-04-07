"use client"

import { useEffect, useRef } from "react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { SplitFlapText, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { siteConfig } from "@/lib/site-config"
import { trackCalendarClick } from "@/lib/use-tracker"
import gsap from "gsap"

export function FlowStudioHero() {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return
    // Simple entrance animation only — no scroll-driven scrub that can fight user scroll
    gsap.fromTo(
      contentRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.1 }
    )
  }, [])

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center px-4 sm:pl-6 md:pl-28 sm:pr-6 md:pr-12 pt-20 pb-12 md:py-24">
      <AnimatedNoise opacity={0.03} />

      {/* Left vertical label — hidden on mobile */}
      <div className="hidden md:block absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          AI MANUFACTURING HUB
        </span>
      </div>

      {/* Main content */}
      <div ref={contentRef} className="flex-1 w-full">
        {/* Logo - hidden on mobile since it's in the nav bar */}
        <div className="hidden md:flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-accent flex items-center justify-center">
            <span className="font-mono text-xs text-accent-foreground font-bold">FS</span>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">FlowStudio</span>
        </div>

        <SplitFlapAudioProvider>
          <div className="relative pb-2">
            <SplitFlapText text="FLOWSTUDIO" speed={80} />
          </div>
        </SplitFlapAudioProvider>

        <h2 className="font-[var(--font-bebas)] text-muted-foreground/60 text-[clamp(1rem,3vw,2rem)] mt-4 tracking-wide">
          AI Systems for Indian Manufacturing SMBs
        </h2>

        <p className="mt-6 max-w-xl font-mono text-sm text-muted-foreground leading-relaxed">
          We build and deploy AI systems for manufacturing SMBs in India, focused on real operational workflows instead of surface-level software layers. Our approach is deep vertical integration so AI can work inside the business, not just around it.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <a
            href="#risk-assessment"
            className="group inline-flex items-center gap-3 bg-accent text-accent-foreground px-5 py-3 font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-all duration-200"
          >
            <ScrambleTextOnHover text="Start Assessment" as="span" duration={0.6} />
            <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
          </a>
          <a
            href={siteConfig.calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCalendarClick("hero_cta")}
            className="group inline-flex items-center gap-3 border border-foreground/20 px-5 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
          >
            <ScrambleTextOnHover text="Book a Call" as="span" duration={0.6} />
          </a>
        </div>

        {/* Contact info strip */}
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
          >
            {siteConfig.contact.email}
          </a>
          <span className="text-border hidden sm:block">|</span>
          <a
            href={`tel:${siteConfig.contact.phone.replace(/[^+\d]/g, "")}`}
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
          >
            {siteConfig.contact.phoneDisplay}
          </a>
        </div>
      </div>


    </section>
  )
}
