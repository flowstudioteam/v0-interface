"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"
import { trackCalendarClick } from "@/lib/use-tracker"

const navItems = [
  { id: "hero", label: "Home" },
  { id: "problems", label: "Bottlenecks" },
  { id: "risk-assessment", label: "Risk Assessment" },
  { id: "market", label: "Research" },
  { id: "chat", label: "Ask AI" },
  { id: "contact", label: "Contact" },
]

export function FlowStudioNav() {
  const [activeSection, setActiveSection] = useState("hero")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
      {/* Mobile header bar */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-between px-4 py-3 bg-background/90 backdrop-blur-sm border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-accent flex items-center justify-center">
            <span className="font-mono text-[9px] text-accent-foreground font-bold">FS</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">FlowStudio</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-8 h-8 flex flex-col items-center justify-center gap-1"
          aria-label="Toggle menu"
        >
          <span className={cn("w-5 h-0.5 bg-foreground transition-all duration-200", mobileMenuOpen && "rotate-45 translate-y-1.5")} />
          <span className={cn("w-5 h-0.5 bg-foreground transition-all duration-200", mobileMenuOpen && "opacity-0")} />
          <span className={cn("w-5 h-0.5 bg-foreground transition-all duration-200", mobileMenuOpen && "-rotate-45 -translate-y-1.5")} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-background/95 backdrop-blur-sm pt-16">
          <nav className="flex flex-col items-center justify-center h-full gap-6 pb-20">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={cn(
                  "font-mono text-sm uppercase tracking-widest transition-colors",
                  activeSection === id ? "text-accent" : "text-muted-foreground"
                )}
              >
                {label}
              </button>
            ))}
            <a
              href={siteConfig.calendarLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { trackCalendarClick("mobile_nav"); setMobileMenuOpen(false) }}
              className="mt-4 px-6 py-3 bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest"
            >
              Book a Call
            </a>
          </nav>
        </div>
      )}

      {/* Desktop sidebar nav */}
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
    </>
  )
}
