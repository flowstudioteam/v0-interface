"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"
import { trackCalendarClick } from "@/lib/use-tracker"

const navItems = [
  { id: "hero", label: "Home" },
  { id: "problems", label: "Bottlenecks" },
  { id: "case-studies", label: "Case Studies" },
  { id: "market", label: "Market Insights" },
  { id: "assessment", label: "Assessment" },
  { id: "chat", label: "Ask AI" },
  { id: "contact", label: "Contact" },
]

export function FlowStudioNav() {
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 },
    )

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="fixed left-0 top-0 z-50 h-screen w-16 md:w-20 hidden md:flex flex-col justify-center border-r border-border/30 bg-background/80 backdrop-blur-sm">
      {/* Logo */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <div className="w-8 h-8 bg-accent flex items-center justify-center">
          <span className="font-mono text-[10px] text-accent-foreground font-bold">FS</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4">
        {navItems.map(({ id, label }) => (
          <button key={id} onClick={() => scrollToSection(id)} className="group relative flex items-center gap-3">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-all duration-300",
                activeSection === id ? "bg-accent scale-125" : "bg-muted-foreground/40 group-hover:bg-foreground/60",
              )}
            />
            <span
              className={cn(
                "absolute left-6 font-mono text-[10px] uppercase tracking-widest opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:left-8 whitespace-nowrap",
                activeSection === id ? "text-accent" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Contact Us — bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <a
          href={siteConfig.calendarLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCalendarClick("nav_contact")}
          title="Contact Us — Book a call"
          className="group flex items-center justify-center w-8 h-8 border border-accent/40 hover:border-accent hover:bg-accent/10 transition-all duration-200"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="text-accent">
            <rect x="1" y="2" width="10" height="9" rx="0" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M1 5h10" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="sr-only">Contact Us</span>
        </a>
        <div className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/40 -rotate-90 origin-center whitespace-nowrap">
          v1.0
        </div>
      </div>
    </nav>
  )
}
