import { FlowStudioHero } from "@/components/flowstudio-hero"
import { FlowStudioNav } from "@/components/flowstudio-nav"
import FlowStudioFooter from "@/components/flowstudio-footer"
import { ProblemCardsSection } from "@/components/problem-cards-section"
import { CaseStudiesSection } from "@/components/case-studies-section"
import { MarketInsightsSection } from "@/components/market-insights-section"
import { AssessmentWizard } from "@/components/assessment-wizard"
import { AIChatSection } from "@/components/ai-chat-section"
import { InquiryForm } from "@/components/inquiry-form"
import VisitorTracker from "@/components/visitor-tracker"

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <VisitorTracker />
      <FlowStudioNav />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10">
        <FlowStudioHero />
        <ProblemCardsSection />
        <CaseStudiesSection />
        <MarketInsightsSection />
        <AssessmentWizard />
        <AIChatSection />
        <InquiryForm />
        <FlowStudioFooter />
      </div>
    </main>
  )
}
