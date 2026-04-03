"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const caseStudies = [
  {
    id: "steel-plant",
    company: "Major Steel Manufacturer",
    location: "Gujarat, India",
    industry: "Steel & Metal",
    challenge: "Surface Defect Detection",
    problem: "Lost ₹15 crore annually to undetected surface defects that reached customers, causing returns and reputation damage.",
    solution: "Deployed AI-powered computer vision system for real-time surface inspection across production lines.",
    results: [
      { metric: "Defect Detection", value: "98.5%", improvement: "+45%" },
      { metric: "Annual Savings", value: "₹10 Cr", improvement: "ROI in 8mo" },
      { metric: "Customer Returns", value: "↓68%", improvement: "First year" },
    ],
    source: "OxMaint Case Study 2024",
    timeline: "8 months to full ROI",
  },
  {
    id: "cement-producer",
    company: "Regional Cement Producer",
    location: "Rajasthan, India",
    industry: "Cement & Building Materials",
    challenge: "Predictive Maintenance",
    problem: "Reactive maintenance causing 45+ hours of unplanned downtime monthly, costing ₹12 crore annually.",
    solution: "Implemented IoT sensors + AI predictive maintenance system across kilns and grinding mills.",
    results: [
      { metric: "Downtime Reduction", value: "72%", improvement: "First year" },
      { metric: "Annual Savings", value: "₹8 Cr", improvement: "Ongoing" },
      { metric: "Equipment Life", value: "+25%", improvement: "Extended" },
    ],
    source: "OxMaint Case Study 2024",
    timeline: "6 months to full deployment",
  },
  {
    id: "auto-parts",
    company: "Tier-2 Auto Parts Supplier",
    location: "Pune, India",
    industry: "Automotive Components",
    challenge: "Quality Control & Rejection Rate",
    problem: "72.4% PPM rejection rate causing customer penalties and rework costs of ₹6 lakh/month.",
    solution: "AI-based statistical process control with real-time alerts and automated quality gates.",
    results: [
      { metric: "Rejection Rate", value: "↓58%", improvement: "PPM reduced" },
      { metric: "Monthly Savings", value: "₹4.2L", improvement: "Direct" },
      { metric: "OEM Rating", value: "A→A+", improvement: "Upgraded" },
    ],
    source: "Nature.com Manufacturing Study",
    timeline: "4 months to measurable impact",
  },
  {
    id: "pharma-sme",
    company: "Pharma Manufacturing SME",
    location: "Hyderabad, India",
    industry: "Pharmaceutical",
    challenge: "Production Planning & Inventory",
    problem: "30% capacity loss due to poor production-sales alignment and ₹2.5 crore tied in excess inventory.",
    solution: "AI demand forecasting integrated with production scheduling and inventory optimization.",
    results: [
      { metric: "Capacity Utilization", value: "+28%", improvement: "Increase" },
      { metric: "Inventory Reduction", value: "₹1.8Cr", improvement: "Working capital freed" },
      { metric: "Stockout Incidents", value: "↓82%", improvement: "Near zero" },
    ],
    source: "Industry Implementation Report",
    timeline: "5 months to optimization",
  },
]

export function CaseStudiesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [activeCase, setActiveCase] = useState(caseStudies[0].id)

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current) return

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
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const activeCaseData = caseStudies.find(c => c.id === activeCase)

  return (
    <section ref={sectionRef} id="case-studies" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 bg-card/30">
      {/* Section header */}
      <div ref={headerRef} className="mb-16">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">02 / Case Studies</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
          REAL RESULTS FROM INDIAN PLANTS
        </h2>
        <p className="mt-4 max-w-2xl font-mono text-sm text-muted-foreground leading-relaxed">
          Verified outcomes from manufacturers who implemented AI solutions. These are not projections — 
          these are measured results from live deployments.
        </p>
      </div>

      {/* Case study selector tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border/30 pb-4">
        {caseStudies.map((study) => (
          <button
            key={study.id}
            onClick={() => setActiveCase(study.id)}
            className={cn(
              "px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all duration-200",
              activeCase === study.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {study.industry}
          </button>
        ))}
      </div>

      {/* Active case study detail */}
      {activeCaseData && (
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Main info */}
          <div className="lg:col-span-2 border border-border/40 p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-tight text-foreground">
                  {activeCaseData.company}
                </h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {activeCaseData.location} • {activeCaseData.industry}
                </span>
              </div>
              <span className="px-3 py-1 bg-accent/10 border border-accent/30 font-mono text-[10px] uppercase tracking-widest text-accent">
                {activeCaseData.challenge}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  The Problem
                </h4>
                <p className="font-mono text-sm text-foreground leading-relaxed">
                  {activeCaseData.problem}
                </p>
              </div>

              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Our Solution
                </h4>
                <p className="font-mono text-sm text-foreground leading-relaxed">
                  {activeCaseData.solution}
                </p>
              </div>

              <div className="pt-4 border-t border-border/30">
                <span className="font-mono text-[9px] text-muted-foreground/60">
                  Source: {activeCaseData.source} • Timeline: {activeCaseData.timeline}
                </span>
              </div>
            </div>
          </div>

          {/* Results metrics */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-4">
              Measured Results
            </h4>
            {activeCaseData.results.map((result, index) => (
              <div
                key={index}
                className="border border-border/40 p-6 bg-background"
              >
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-2">
                  {result.metric}
                </span>
                <div className="flex items-end justify-between">
                  <span className="font-[var(--font-bebas)] text-4xl text-accent">
                    {result.value}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {result.improvement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


    </section>
  )
}
