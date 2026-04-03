"use client"

import { useEffect, useRef } from "react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { SplitFlapText, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import { BitmapChevron } from "@/components/bitmap-chevron"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: "60M+", label: "MSMEs in India" },
  { value: "$490B", label: "AI Value Potential" },
  { value: "8%", label: "MSME AI Adoption" },
  { value: "₹50Cr+", label: "Savings Delivered" },
]

export function FlowStudioHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })

      // Animate stats
      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll(".stat-item")
        gsap.fromTo(
          statItems,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            delay: 1.2,
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center pl-6 md:pl-28 pr-6 md:pr-12 py-20 md:py-24">
      <AnimatedNoise opacity={0.03} />

      {/* Left vertical label */}
      <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          AI MANUFACTURING HUB
        </span>
      </div>

      {/* Main content */}
      <div ref={contentRef} className="flex-1 w-full">
        <div className="flex items-center gap-3 mb-6">
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

        <p className="mt-8 max-w-xl font-mono text-sm text-muted-foreground leading-relaxed">
          We build and deploy AI systems for manufacturing SMBs in India, starting with the most painful operational 
          bottlenecks: production control, predictive maintenance, quality control, and planning. Not generic dashboards. 
          Deep workflow-specific AI agents that integrate into plant operations.
        </p>

        <p className="mt-4 max-w-xl font-mono text-xs text-accent leading-relaxed">
          {"\""}We are the intelligence and automation layer for manufacturing — solving one hard workflow at a time.{"\""}
        </p>

        {/* Stats row */}
        <div ref={statsRef} className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 max-w-3xl">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="font-[var(--font-bebas)] text-3xl md:text-4xl text-foreground">{stat.value}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-4 md:gap-8">
          <a
            href="#assessment"
            className="group inline-flex items-center gap-3 bg-accent text-accent-foreground px-6 py-4 font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-all duration-200"
          >
            <ScrambleTextOnHover text="Start Free Assessment" as="span" duration={0.6} />
            <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
          </a>
          <a
            href="#problems"
            className="group inline-flex items-center gap-3 border border-foreground/20 px-6 py-4 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
          >
            <ScrambleTextOnHover text="Explore Bottlenecks" as="span" duration={0.6} />
          </a>
          <a
            href="#case-studies"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            View Case Studies
          </a>
        </div>
      </div>

      {/* Floating info tag */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
        <div className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Trusted by 500+ Indian Manufacturers
        </div>
      </div>
    </section>
  )
}
