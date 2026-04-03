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
    lossEstimate: "₹2-8 Lakh/month",
    source: "ERPDrive.in Research",
    category: "Supply Chain",
    description: "Inventory tracked in registers/spreadsheets leads to material shortages and delayed procurement decisions.",
  },
  {
    id: "dispatch",
    title: "Order Fulfillment Blocks",
    icon: "02",
    painExample: "Orders ready but stuck in dispatch chaos",
    lossEstimate: "₹3-10 Lakh/month",
    source: "Industry Standard",
    category: "Operations",
    description: "Poor coordination between production, quality, and logistics causes fulfillment delays.",
  },
  {
    id: "qc-rejects",
    title: "QC Rejects & Manual Inspection",
    icon: "03",
    painExample: "10+ workers doing visual inspection daily",
    lossEstimate: "₹5-15 Lakh/month",
    source: "Nature.com Study (72.4% PPM)",
    category: "Quality",
    description: "Manual quality checks miss defects, leading to high rejection rates and customer complaints.",
  },
  {
    id: "breakdown",
    title: "Machine Breakdown & Downtime",
    icon: "04",
    painExample: "Sudden stops, emergency repairs, production loss",
    lossEstimate: "₹8-25 Lakh/month",
    source: "OxMaint Case Studies",
    category: "Maintenance",
    description: "Unplanned downtime disrupts schedules and costs 3-5x more than planned maintenance.",
  },
  {
    id: "predictive",
    title: "Predictive Maintenance Gaps",
    icon: "05",
    painExample: "Machines serviced only after breakdown",
    lossEstimate: "₹4-12 Lakh/month",
    source: "Deloitte 2025 Survey",
    category: "Maintenance",
    description: "Reactive maintenance approach leads to higher costs, longer downtime, and reduced equipment life.",
  },
  {
    id: "inventory",
    title: "Inventory Mismatch & Stock-outs",
    icon: "06",
    painExample: "Raw material either excess or critically short",
    lossEstimate: "₹3-10 Lakh/month",
    source: "IJournal Research",
    category: "Supply Chain",
    description: "No real-time visibility into stock levels causes overstocking costs and production delays.",
  },
  {
    id: "productivity",
    title: "Productivity & Manpower Tracking",
    icon: "07",
    painExample: "Don&apos;t know who&apos;s working on what",
    lossEstimate: "₹2-6 Lakh/month",
    source: "Deloitte 2025 Survey",
    category: "Operations",
    description: "Lack of visibility into workforce productivity leads to inefficient scheduling and labor costs.",
  },
  {
    id: "planning",
    title: "Sales vs Production Mismatch",
    icon: "08",
    painExample: "Orders accepted that cannot be fulfilled on time",
    lossEstimate: "₹5-15 Lakh/month",
    source: "Industry Standard",
    category: "Planning",
    description: "Disconnected sales and production planning leads to overpromising and underdelivering.",
  },
  {
    id: "vision",
    title: "Visual Defect Detection",
    icon: "09",
    painExample: "Customer returns due to missed surface defects",
    lossEstimate: "₹8-20 Lakh/month",
    source: "OxMaint Steel Case",
    category: "Quality",
    description: "Human inspection misses subtle defects that AI-powered computer vision can catch consistently.",
  },
  {
    id: "data",
    title: "Data Scattered in Excel/Tally",
    icon: "10",
    painExample: "No single view of the business, decisions by gut",
    lossEstimate: "₹5-12 Lakh/month",
    source: "Creviz.io Research",
    category: "Data",
    description: "Excel/Tally breaks down beyond 20-30 employees; causes version conflicts and poor decisions.",
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
    <section ref={sectionRef} id="problems" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12">
      {/* Section header */}
      <div ref={headerRef} className="mb-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">01 / Bottlenecks</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
          WHICH PROBLEM IS EATING YOUR PROFIT?
        </h2>
        <p className="mt-4 max-w-2xl font-mono text-sm text-muted-foreground leading-relaxed">
          Select up to 3 bottlenecks that cost you the most. Based on research from Deloitte, World Economic Forum, 
          and real case studies from Indian manufacturers.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={cn(
              "px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-all duration-200",
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
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
