"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const problems = [
  {
    id: "procurement",
    title: "Procurement & Supplier Delays",
    icon: "01",
    painExample: "Material arrives late, production stalls for days",
    lossEstimate: "₹2–8 Lakh/month",
    source: "NASSCOM AI Adoption Index 2.0, 2024",
    category: "Supply Chain",
    description: "Inventory tracked in registers or spreadsheets leads to material shortages and delayed procurement decisions — one of the most common digitisation gaps cited in NASSCOM's MSME AI adoption research.",
  },
  {
    id: "dispatch",
    title: "Order Fulfillment Blocks",
    icon: "02",
    painExample: "Orders ready but stuck in dispatch chaos",
    lossEstimate: "₹3–10 Lakh/month",
    source: "Deloitte Smart Manufacturing Survey, 2025",
    category: "Operations",
    description: "Poor coordination between production, quality, and logistics causes fulfillment delays. Deloitte (2025) found 65% of manufacturers cite operational risk — including dispatch failures — as their top concern.",
  },
  {
    id: "qc-rejects",
    title: "QC Rejects & Manual Inspection",
    icon: "03",
    painExample: "10+ workers doing visual inspection daily",
    lossEstimate: "₹5–15 Lakh/month",
    source: "Nature.com Scientific Reports — Automotive SME Study, Chennai, 2025",
    category: "Quality",
    description: "Manual inspection misses defects at scale. A peer-reviewed study of Chennai automotive SMEs recorded a 72.4% PPM rejection rate in plants relying on human quality control, with an 88.9% improvement after AI implementation.",
  },
  {
    id: "breakdown",
    title: "Machine Breakdown & Downtime",
    icon: "04",
    painExample: "Sudden stops, emergency repairs, production loss",
    lossEstimate: "₹8–25 Lakh/month",
    source: "OxMaint — Indian Cement Plant Case Study, 2024 + NTPC Case Study, 2024",
    category: "Maintenance",
    description: "Unplanned downtime costs 3–5x more than planned maintenance. A documented Indian cement plant case study recorded ₹8 Cr annual savings after eliminating unplanned kiln stops via AI. NTPC prevented a single failure worth ₹4.2 Cr.",
  },
  {
    id: "predictive",
    title: "Predictive Maintenance Gaps",
    icon: "05",
    painExample: "Machines serviced only after breakdown",
    lossEstimate: "₹4–12 Lakh/month",
    source: "Deloitte Smart Manufacturing Survey, 2025; OxMaint, 2024",
    category: "Maintenance",
    description: "Reactive maintenance is the default for most Indian SMBs. Deloitte (2025) reports AI predictive maintenance delivers ROI within 3–6 months. AI-enabled systems reduce equipment failures by up to 70% and unplanned downtime by 65%.",
  },
  {
    id: "inventory",
    title: "Inventory Mismatch & Stock-outs",
    icon: "06",
    painExample: "Raw material either excess or critically short",
    lossEstimate: "₹3–10 Lakh/month",
    source: "WEF AI Playbook for India's MSMEs, August 2025",
    category: "Supply Chain",
    description: "No real-time inventory visibility causes simultaneous overstocking and stockouts. WEF (2025) identifies inventory optimisation as one of the highest-ROI AI use cases for Indian MSMEs with immediate working capital impact.",
  },
  {
    id: "productivity",
    title: "Productivity & Manpower Tracking",
    icon: "07",
    painExample: "Don&apos;t know who&apos;s working on what",
    lossEstimate: "₹2–6 Lakh/month",
    source: "Deloitte Smart Manufacturing Survey, 2025",
    category: "Operations",
    description: "Lack of workforce visibility leads to inefficient scheduling. Deloitte (2025) found 48% of manufacturers face critical production staffing and productivity tracking challenges that AI-powered dashboards directly address.",
  },
  {
    id: "planning",
    title: "Sales vs Production Mismatch",
    icon: "08",
    painExample: "Orders accepted that cannot be fulfilled on time",
    lossEstimate: "₹5–15 Lakh/month",
    source: "KPMG Global Tech Report: Industrial Manufacturing, 2025",
    category: "Planning",
    description: "Disconnected sales and production planning leads to overpromising and underdelivering. KPMG (2025) identifies supply chain and planning functions as the biggest maturity gaps preventing full AI value realisation in manufacturing.",
  },
  {
    id: "vision",
    title: "Visual Defect Detection",
    icon: "09",
    painExample: "Customer returns due to missed surface defects",
    lossEstimate: "₹8–20 Lakh/month",
    source: "OxMaint — AI Vision Inspection Case Study, 2024",
    category: "Quality",
    description: "Human inspection consistently misses subtle defects. A documented electronics manufacturer case study reports 99.8% detection accuracy and 0.2% defect escape rate after deploying AI vision across 9 production lines, preventing $8M in recall costs.",
  },
  {
    id: "data",
    title: "Data Scattered in Excel / Tally",
    icon: "10",
    painExample: "No single view of the business, decisions by gut",
    lossEstimate: "₹5–12 Lakh/month",
    source: "NASSCOM AI Adoption Index 2.0, 2024; WEF AI Playbook, 2025",
    category: "Data",
    description: "72% of MSMEs have no structured data foundation — AI cannot work on scattered Excel/Tally records. NASSCOM (2024) identifies data readiness as the single biggest technical barrier to AI adoption in Indian manufacturing SMBs.",
  },
]

export function ProblemCardsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [selectedProblems, setSelectedProblems] = useState<string[]>([])
  const [filter, setFilter] = useState<string>("all")

  const categories = ["all", ...Array.from(new Set(problems.map(p => p.category)))]

  const filteredProblems = filter === "all" 
    ? problems 
    : problems.filter(p => p.category === filter)

  const toggleProblem = (id: string) => {
    setSelectedProblems(prev => {
      if (prev.includes(id)) {
        return prev.filter(p => p !== id)
      }
      if (prev.length >= 3) {
        return prev // Max 3 selections
      }
      return [...prev, id]
    })
  }

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !gridRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = gridRef.current?.querySelectorAll(".problem-card")
      if (cards && cards.length > 0) {
        gsap.set(cards, { y: 60, opacity: 0 })
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="problems" className="relative py-16 md:py-32 px-4 sm:pl-6 md:pl-28 sm:pr-6 md:pr-12">
      {/* Section header */}
      <div ref={headerRef} className="mb-8 md:mb-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">01 / Bottlenecks</span>
        <h2 className="mt-3 font-[var(--font-bebas)] text-3xl sm:text-5xl md:text-7xl tracking-tight leading-none">
          WHICH PROBLEM IS EATING YOUR PROFIT?
        </h2>
        <p className="mt-3 max-w-xl font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Select up to 3 bottlenecks. Loss estimates from Deloitte, WEF, NASSCOM, KPMG.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={cn(
              "px-3 py-1.5 sm:px-4 sm:py-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest border transition-all duration-200 whitespace-nowrap shrink-0",
              filter === category
                ? "bg-accent text-accent-foreground border-accent"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Selected count indicator */}
      {selectedProblems.length > 0 && (
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-xs text-accent">
            {selectedProblems.length}/3 Selected
          </span>
          <a
            href="#assessment"
            className="font-mono text-xs uppercase tracking-widest text-foreground hover:text-accent transition-colors"
          >
            Continue to Assessment →
          </a>
        </div>
      )}

      {/* Problem cards grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
      >
        {filteredProblems.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            isSelected={selectedProblems.includes(problem.id)}
            onToggle={() => toggleProblem(problem.id)}
            disabled={selectedProblems.length >= 3 && !selectedProblems.includes(problem.id)}
          />
        ))}
      </div>
    </section>
  )
}

function ProblemCard({
  problem,
  isSelected,
  onToggle,
  disabled,
}: {
  problem: typeof problems[0]
  isSelected: boolean
  onToggle: () => void
  disabled: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <article
      className={cn(
        "problem-card group relative border p-6 flex flex-col transition-all duration-300 cursor-pointer min-h-[280px]",
        isSelected
          ? "border-accent bg-accent/10"
          : disabled
          ? "border-border/30 opacity-50 cursor-not-allowed"
          : "border-border/40 hover:border-accent/60",
      )}
      onClick={() => !disabled && onToggle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection indicator */}
      <div className={cn(
        "absolute top-4 right-4 w-5 h-5 border-2 flex items-center justify-center transition-all duration-200",
        isSelected ? "border-accent bg-accent" : "border-muted-foreground/40"
      )}>
        {isSelected && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" className="text-accent-foreground" />
          </svg>
        )}
      </div>

      {/* Icon and category */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="font-[var(--font-bebas)] text-4xl text-muted-foreground/30">{problem.icon}</span>
          <span className="block font-mono text-[9px] uppercase tracking-widest text-accent mt-1">
            {problem.category}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className={cn(
        "font-[var(--font-bebas)] text-xl tracking-tight mb-3 transition-colors duration-300",
        isSelected || isHovered ? "text-accent" : "text-foreground"
      )}>
        {problem.title}
      </h3>

      {/* Pain example */}
      <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-4 flex-grow">
        {problem.painExample}
      </p>

      {/* Loss estimate */}
      <div className="border-t border-border/30 pt-4 mt-auto">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 block">
              Est. Monthly Loss
            </span>
            <span className="font-[var(--font-bebas)] text-2xl text-destructive">
              {problem.lossEstimate}
            </span>
          </div>
        </div>
        <span className="font-mono text-[8px] text-muted-foreground/40 mt-2 block">
          Source: {problem.source}
        </span>
      </div>

      {/* Hover description overlay */}
      <div className={cn(
        "absolute inset-0 bg-card/95 p-6 flex flex-col justify-center transition-opacity duration-300",
        isHovered && !isSelected ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <p className="font-mono text-sm text-foreground leading-relaxed">
          {problem.description}
        </p>
        <span className="font-mono text-xs text-accent mt-4">
          Click to select this bottleneck
        </span>
      </div>
    </article>
  )
}
