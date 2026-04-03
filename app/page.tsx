import { FlowStudioHero } from "@/components/flowstudio-hero"
import { FlowStudioNav } from "@/components/flowstudio-nav"
import { ProblemCardsSection } from "@/components/problem-cards-section"
import { CaseStudiesSection } from "@/components/case-studies-section"
import { MarketInsightsSection } from "@/components/market-insights-section"
import { AssessmentWizard } from "@/components/assessment-wizard"
import { AIChatSection } from "@/components/ai-chat-section"

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <FlowStudioNav />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10">
        <FlowStudioHero />
        <ProblemCardsSection />
        <CaseStudiesSection />
        <MarketInsightsSection />
        <AssessmentWizard />
        <AIChatSection />
        
        {/* Footer */}
        <footer className="py-16 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-accent flex items-center justify-center">
                  <span className="font-mono text-xs text-accent-foreground font-bold">FS</span>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-foreground">FlowStudio</span>
              </div>
              <p className="font-mono text-xs text-muted-foreground max-w-sm leading-relaxed">
                Building and deploying AI systems for manufacturing SMBs in India. 
                The intelligence and automation layer for manufacturing.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-8">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Solutions</h4>
                <ul className="space-y-2">
                  <li><a href="#problems" className="font-mono text-xs text-foreground hover:text-accent transition-colors">Quality Control</a></li>
                  <li><a href="#problems" className="font-mono text-xs text-foreground hover:text-accent transition-colors">Predictive Maintenance</a></li>
                  <li><a href="#problems" className="font-mono text-xs text-foreground hover:text-accent transition-colors">Production Planning</a></li>
                  <li><a href="#problems" className="font-mono text-xs text-foreground hover:text-accent transition-colors">Inventory Optimization</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#case-studies" className="font-mono text-xs text-foreground hover:text-accent transition-colors">Case Studies</a></li>
                  <li><a href="#market" className="font-mono text-xs text-foreground hover:text-accent transition-colors">Market Research</a></li>
                  <li><a href="#chat" className="font-mono text-xs text-foreground hover:text-accent transition-colors">Ask AI</a></li>
                  <li><a href="#assessment" className="font-mono text-xs text-foreground hover:text-accent transition-colors">Free Assessment</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Contact</h4>
                <ul className="space-y-2">
                  <li><span className="font-mono text-xs text-foreground">hello@flowstudio.ai</span></li>
                  <li><span className="font-mono text-xs text-foreground">+91 XXX XXX XXXX</span></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[10px] text-muted-foreground">
              © 2026 FlowStudio. All rights reserved.
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              Research sources: WEF, Deloitte, NASSCOM, EY-CII, OxMaint, IndiaAI Mission
            </span>
          </div>
        </footer>
      </div>
    </main>
  )
}
