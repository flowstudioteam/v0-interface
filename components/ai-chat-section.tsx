"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"
import { trackCalendarClick, getStoredSessionId } from "@/lib/use-tracker"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  "How is AI being used in Indian manufacturing today?",
  "What ROI can I expect from predictive maintenance?",
  "How do MSMEs in India benefit from AI adoption?",
  "What are the barriers to AI adoption for small manufacturers?",
  "How does Flow Studio differ from traditional software vendors?",
  "What government schemes support AI adoption for MSMEs?",
  "How long does it take to see results from AI implementation?",
  "What data do I need to start with AI solutions?",
]

const faqResponses: Record<string, string> = {
  "How is AI being used in Indian manufacturing today?": `AI adoption in Indian manufacturing is accelerating, though it remains concentrated among larger enterprises. According to the EY-CII Report (November 2025), 47% of enterprises now have multiple AI use cases live in production.

**Key Applications:**
- **Quality Inspection**: Computer vision systems detecting defects that human inspectors miss
- **Predictive Maintenance**: IoT sensors + ML models predicting equipment failures before they happen
- **Demand Forecasting**: AI models improving inventory planning and reducing stockouts
- **Production Scheduling**: Optimization algorithms maximizing throughput and minimizing changeovers

**The MSME Gap:**
While large enterprises are at 23% AI adoption, MSMEs lag at just 8% (AI Tech News India). This gap represents a massive opportunity - the World Economic Forum estimates $490-685 billion in untapped value for Indian MSMEs through AI adoption.

**Source**: WEF "Transforming Small Businesses: An AI Playbook for India's SMEs" (August 2025)`,

  "What ROI can I expect from predictive maintenance?": `Based on verified case studies from Indian manufacturers, predictive maintenance delivers some of the fastest ROI in manufacturing AI:

**Real Results:**
- **Cement Producer (Rajasthan)**: 72% reduction in unplanned downtime, ₹8 Cr saved in first year
- **Steel Manufacturer (Gujarat)**: Equipment life extended by 25%, ₹10 Cr annual savings
- **Industry Average**: Predictive maintenance costs 3-5x less than reactive maintenance

**Typical ROI Timeline:**
- Initial deployment: 6-8 weeks
- First measurable impact: 3 months
- Full ROI: 6-12 months
- Ongoing savings: 15-25% reduction in maintenance costs annually

**Why It Works:**
Traditional maintenance is either time-based (wasteful) or breakdown-based (expensive). AI-powered predictive maintenance monitors actual machine health indicators and alerts you before failure, allowing planned repairs during scheduled downtime.

**Source**: OxMaint Case Studies 2024, Deloitte Smart Manufacturing Survey 2025`,

  "How do MSMEs in India benefit from AI adoption?": `The World Economic Forum's August 2025 report identifies massive potential for Indian MSMEs through AI adoption:

**Economic Impact:**
- **$490-685 billion** in potential value creation
- **45-62% growth potential** for the MSME sector
- MSMEs currently contribute $1.1 trillion to India's GDP; AI can significantly amplify this

**Top Benefits for MSMEs:**
1. **Cost Reduction**: 20-40% reduction in operational costs through automation
2. **Quality Improvement**: 60-80% reduction in defect rates with AI inspection
3. **Downtime Prevention**: 50-70% reduction in unplanned machine stops
4. **Better Decisions**: Data-driven insights replacing gut-feel management
5. **Competitive Edge**: Meeting quality standards required by larger OEMs

**The IMPACT Framework** (WEF recommendation for MSMEs):
- **I**dentify specific pain points
- **M**easure current losses
- **P**rioritize high-ROI applications
- **A**dopt incrementally
- **C**ontinuously improve
- **T**rain your workforce

**Source**: WEF "Transforming Small Businesses: An AI Playbook for India's SMEs" (August 2025)`,

  "What are the barriers to AI adoption for small manufacturers?": `Research from Deloitte, NASSCOM, and the World Economic Forum identifies five key barriers preventing MSMEs from adopting AI:

**1. Cost Sensitivity (50%)**
Half of Indian businesses prioritize pricing over performance. Traditional AI solutions cost ₹10-50 Lakh+ which is unaffordable for most SMEs.

**2. Awareness Gap (68%)**
Most MSME owners know AI exists but don't understand how it applies to their specific operations or what ROI is realistic.

**3. Data Readiness (72%)**
Data is scattered across Excel sheets, Tally, WhatsApp, and paper registers. There's no single source of truth to train AI models.

**4. Skilled Workforce (48%)**
Finding and retaining tech talent is challenging. MSMEs can't compete with IT salaries offered by large companies.

**5. Integration Complexity (45%)**
Connecting new AI systems with existing ERPs, Tally, and shop floor processes is technically challenging.

**How Flow Studio Addresses These:**
- Affordable pricing starting at ₹4,999/month
- Free assessment to demonstrate specific ROI
- Data integration as part of deployment
- Fully managed service - no AI expertise needed
- Workflow-specific solutions, not generic dashboards

**Source**: Deloitte Smart Manufacturing Survey 2025, NASSCOM AI Adoption Index`,

  "How does Flow Studio differ from traditional software vendors?": `Traditional software vendors and Flow Studio take fundamentally different approaches:

**Traditional Software Approach:**
- Build generic platforms and sell licenses
- Heavy customization needed (expensive and slow)
- Require IT teams for implementation and maintenance
- Focus on features, not outcomes
- 6-18 month implementation cycles
- Cost: ₹10-50 Lakh+ upfront + annual licenses

**Flow Studio Approach:**
- Build workflow-specific AI agents
- Pre-configured for common manufacturing bottlenecks
- Fully managed service - we handle the tech
- Focus on measurable business outcomes
- 4-8 week deployment to first value
- Cost: Starting at ₹4,999/month

**Key Differences:**
1. **Specialization**: We only do manufacturing SMBs. This focus means deep domain expertise.
2. **Outcome-Based**: We measure success by your savings, not feature checkboxes.
3. **Affordability**: Priced for Indian SMBs, not enterprise budgets.
4. **Speed**: See results in weeks, not months.
5. **No IT Burden**: We manage everything; you focus on manufacturing.

**Our Philosophy:**
"We solve one hard workflow at a time, compound domain knowledge, and push AI and robotics deeper into the factory floor."`,

  "What government schemes support AI adoption for MSMEs?": `The Indian government has launched several initiatives supporting AI adoption for MSMEs:

**IndiaAI Mission (₹10,300 Crore over 5 years)**
- 38,000 GPUs deployed for AI compute infrastructure
- MSME-focused AI stack development (similar to UPI concept)
- AI projected to add $1.7 trillion to India's economy by 2035

**IndiaAI Mission 2.0**
Creating standardized AI tools accessible to MSMEs, reducing the need for expensive custom development.

**MSME Digital Transformation Schemes:**
- **CHAMPIONS Portal**: Single-window for MSME grievances and support
- **Digital MSME Scheme**: Subsidies for cloud computing and IT adoption
- **ZED Certification**: Quality certification with technology upgradation support

**State-Level Initiatives:**
Many states offer additional incentives for technology adoption:
- Capital subsidies on equipment
- Interest subvention on tech loans
- Free/subsidized training programs

**How to Access:**
Flow Studio helps customers navigate applicable schemes and can assist with subsidy applications where eligible.

**Source**: MeitY, Ministry of MSME, IndiaAI Mission Documentation`,

  "How long does it take to see results from AI implementation?": `Based on our deployment experience and industry benchmarks, here's what to expect:

**Typical Timeline:**

**Phase 1: Discovery & Setup (2-4 weeks)**
- Understanding your specific bottlenecks
- Data assessment and integration planning
- Hardware/sensor requirements (if any)

**Phase 2: Deployment (4-6 weeks)**
- System installation and integration
- Initial training of AI models
- Team onboarding and training

**Phase 3: Optimization (4-8 weeks)**
- Fine-tuning based on real data
- Expanding coverage
- First measurable ROI

**Total to First Value: 10-18 weeks**

**By Application Type:**

| Application | First Results | Full ROI |
|-------------|---------------|----------|
| Quality Inspection | 4-6 weeks | 3-4 months |
| Predictive Maintenance | 8-12 weeks | 6-8 months |
| Inventory Optimization | 6-8 weeks | 4-6 months |
| Production Planning | 8-12 weeks | 6-9 months |

**Factors That Speed Up:**
- Clean, digital data available
- Clear problem definition
- Management commitment
- Shop floor cooperation

**Factors That Slow Down:**
- Data scattered across systems
- Resistance to change
- Unclear success metrics`,

  "What data do I need to start with AI solutions?": `The good news: you don't need perfect data to start. Here's what's typically required:

**Minimum Data Requirements:**

**For Quality Inspection:**
- Photos/images of defects (even from phone cameras)
- Historical rejection data (even in Excel)
- Product specifications

**For Predictive Maintenance:**
- Basic machine logs (if available)
- Maintenance records (any format)
- Breakdown history (even manual records)
- We can add IoT sensors if needed

**For Inventory Optimization:**
- Current stock data (Excel/Tally)
- Purchase history
- Sales/consumption data
- Lead times

**For Production Planning:**
- Order history
- Production records
- Capacity information

**What If My Data Is Messy?**
Most MSME data IS messy. Part of our deployment includes:
1. Data assessment and cleanup
2. Setting up proper data collection going forward
3. Integration with existing systems (Tally, Excel, etc.)

**The Reality:**
72% of MSMEs have scattered data. We're used to it. We start with what you have and improve data quality as part of the solution.

**First Steps:**
Our free assessment evaluates your data readiness and provides a realistic implementation plan based on your current state.`,
}

export function AIChatSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response with FAQ matching
    setTimeout(() => {
      const response = findBestResponse(content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)

      // Log interaction to DB (fire-and-forget)
      const isSuggested = suggestedQuestions.includes(content)
      fetch("/api/chat-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getStoredSessionId(),
          question: content,
          answer: response.slice(0, 500),
          questionType: isSuggested ? "suggested" : "custom",
        }),
        keepalive: true,
      }).catch(() => {})
    }, 1500)
  }

  const findBestResponse = (query: string): string => {
    // Simple keyword matching for demo
    const queryLower = query.toLowerCase()

    if (queryLower.includes("roi") || queryLower.includes("return") || queryLower.includes("predictive maintenance")) {
      return faqResponses["What ROI can I expect from predictive maintenance?"]
    }
    if (queryLower.includes("barrier") || queryLower.includes("challenge") || queryLower.includes("why not") || queryLower.includes("problem with adoption")) {
      return faqResponses["What are the barriers to AI adoption for small manufacturers?"]
    }
    if (queryLower.includes("msme") || queryLower.includes("sme") || queryLower.includes("small") || queryLower.includes("benefit")) {
      return faqResponses["How do MSMEs in India benefit from AI adoption?"]
    }
    if (queryLower.includes("differ") || queryLower.includes("traditional") || queryLower.includes("software") || queryLower.includes("vendor")) {
      return faqResponses["How does Flow Studio differ from traditional software vendors?"]
    }
    if (queryLower.includes("government") || queryLower.includes("scheme") || queryLower.includes("subsidy") || queryLower.includes("indiaai")) {
      return faqResponses["What government schemes support AI adoption for MSMEs?"]
    }
    if (queryLower.includes("time") || queryLower.includes("how long") || queryLower.includes("result") || queryLower.includes("timeline")) {
      return faqResponses["How long does it take to see results from AI implementation?"]
    }
    if (queryLower.includes("data") || queryLower.includes("need") || queryLower.includes("start") || queryLower.includes("require")) {
      return faqResponses["What data do I need to start with AI solutions?"]
    }
    if (queryLower.includes("ai") && (queryLower.includes("india") || queryLower.includes("manufacturing") || queryLower.includes("use"))) {
      return faqResponses["How is AI being used in Indian manufacturing today?"]
    }

    // Default response
    return `Thank you for your question about "${query}". 

This is a demo interface showcasing our knowledge base about AI in Indian manufacturing. For detailed answers, try asking about:

- AI adoption in Indian manufacturing
- ROI from predictive maintenance
- Benefits for MSMEs
- Adoption barriers
- How we differ from traditional vendors
- Government support schemes
- Implementation timelines
- Data requirements

For a personalized consultation, complete our **free AI Readiness Assessment** above, and our team will reach out with insights specific to your plant.`
  }

  return (
    <section ref={sectionRef} id="chat" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 bg-card/30">
      {/* Section header */}
      <div ref={headerRef} className="mb-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">05 / Ask AI</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
          QUESTIONS ABOUT AI IN MANUFACTURING?
        </h2>
        <p className="mt-4 max-w-2xl font-mono text-sm text-muted-foreground leading-relaxed">
          Ask questions about AI adoption, ROI expectations, implementation challenges, and how manufacturing 
          SMBs in India are leveraging AI. Powered by research from WEF, Deloitte, and real case studies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Suggested questions */}
        <div className="lg:col-span-1">
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
            Suggested Questions
          </h3>
          <div className="space-y-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(question)}
                className="w-full text-left p-3 border border-border/40 font-mono text-xs text-muted-foreground hover:border-accent hover:text-accent transition-all duration-200 leading-relaxed"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Chat interface */}
        <div className="lg:col-span-2 border border-border/40 bg-background flex flex-col h-[600px]">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-4">
                    <span className="font-[var(--font-bebas)] text-2xl text-accent">AI</span>
                  </div>
                  <p className="font-mono text-sm text-muted-foreground max-w-sm">
                    Ask me anything about AI in Indian manufacturing. I&apos;ll answer based on verified research and real case studies.
                  </p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4",
                  message.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 flex items-center justify-center flex-shrink-0",
                  message.role === "user"
                    ? "bg-foreground"
                    : "bg-accent"
                )}>
                  <span className={cn(
                    "font-mono text-[10px]",
                    message.role === "user"
                      ? "text-background"
                      : "text-accent-foreground"
                  )}>
                    {message.role === "user" ? "You" : "AI"}
                  </span>
                </div>
                <div className={cn(
                  "flex-1 max-w-2xl",
                  message.role === "user" ? "text-right" : ""
                )}>
                  <div className={cn(
                    "inline-block p-4 font-mono text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-card border border-border/40 text-foreground"
                  )}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                  <span className="block font-mono text-[9px] text-muted-foreground/60 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="font-mono text-[10px] text-accent-foreground">AI</span>
                </div>
                <div className="bg-card border border-border/40 p-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-border/40 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(input)
              }}
              className="flex gap-4"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about AI in manufacturing..."
                className="flex-1 bg-input border border-border px-4 py-3 font-mono text-sm text-foreground focus:border-accent focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className={cn(
                  "px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-200",
                  input.trim() && !isTyping
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Contact / calendar CTA below chat */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-border/30 p-5">
          <div className="flex-1">
            <p className="font-mono text-xs text-muted-foreground">
              Ready to talk to a human? Our team is available to answer plant-specific questions.
            </p>
            <p className="font-mono text-[10px] text-muted-foreground/60 mt-1">
              {siteConfig.email} &nbsp;·&nbsp; {siteConfig.phone}
            </p>
          </div>
          <a
            href={siteConfig.calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCalendarClick("chat_section")}
            className="shrink-0 px-5 py-2.5 bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors"
          >
            Book a call →
          </a>
        </div>
      </div>
    </section>
  )
}
