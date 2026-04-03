"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"
import { trackCalendarClick, getStoredSessionId } from "@/lib/use-tracker"

const suggestedQuestions = [
  "How is AI being used in Indian manufacturing today?",
  "What ROI can I expect from predictive maintenance?",
  "How do MSMEs in India benefit from AI adoption?",
  "What are the barriers to AI adoption for small manufacturers?",
  "How does FlowStudio differ from traditional software vendors?",
  "What government schemes support AI adoption for MSMEs?",
  "How long does it take to see results from AI implementation?",
  "What data do I need to start with AI solutions?",
]

export function AIChatSection() {
  const [input, setInput] = useState("")
  const [sessionId] = useState(() => getStoredSessionId())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: { id, messages, sessionId },
      }),
    }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    sendMessage({ text: trimmed })
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
    }
  }

  const getMessageText = (msg: (typeof messages)[0]) => {
    if (!msg.parts) return ""
    return msg.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("")
  }

  return (
    <section
      ref={sectionRef}
      id="chat"
      className="relative min-h-screen flex items-start pl-6 md:pl-28 pr-6 md:pr-12 py-20 md:py-28"
    >
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] text-accent uppercase tracking-widest">
              05 / Intelligence Layer
            </span>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl text-foreground leading-none mb-4">
            ASK ABOUT<br />AI IN MANUFACTURING
          </h2>
          <p className="font-mono text-sm text-muted-foreground max-w-xl leading-relaxed">
            Real answers grounded in Indian manufacturing data — from WEF, Deloitte, NASSCOM, and
            plant-level case studies. Powered by GPT-4o mini with a manufacturing-specific system prompt.
          </p>
        </div>

        {/* Chat window */}
        <div className="border border-border/40 bg-card">
          {/* Message list */}
          <div className="h-[420px] overflow-y-auto p-6 flex flex-col gap-6 scroll-smooth">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-6">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest text-center">
                  Select a question or type your own
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      disabled={isLoading}
                      className="text-left px-4 py-3 border border-border/40 hover:border-accent hover:bg-accent/5 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-all duration-150 leading-relaxed"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const text = getMessageText(msg)
              const isUser = msg.role === "user"
              return (
                <div
                  key={msg.id}
                  className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
                >
                  {!isUser && (
                    <div className="shrink-0 w-6 h-6 bg-accent flex items-center justify-center mt-0.5">
                      <span className="font-mono text-[8px] text-accent-foreground font-bold">FS</span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-3 font-mono text-xs leading-relaxed whitespace-pre-wrap",
                      isUser
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-secondary-foreground border border-border/20"
                    )}
                  >
                    {text}
                    {isLoading && msg === messages[messages.length - 1] && !isUser && (
                      <span className="inline-flex gap-0.5 ml-1">
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:300ms]" />
                      </span>
                    )}
                  </div>
                  {isUser && (
                    <div className="shrink-0 w-6 h-6 bg-muted flex items-center justify-center mt-0.5">
                      <span className="font-mono text-[8px] text-muted-foreground">YOU</span>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Typing indicator when submitted but no streaming yet */}
            {status === "submitted" && (
              <div className="flex gap-3 justify-start">
                <div className="shrink-0 w-6 h-6 bg-accent flex items-center justify-center">
                  <span className="font-mono text-[8px] text-accent-foreground font-bold">FS</span>
                </div>
                <div className="bg-secondary border border-border/20 px-4 py-3">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-border/40 p-4 flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask about AI in manufacturing, ROI, implementation timelines…"
              rows={2}
              className="flex-1 bg-input border border-border/60 focus:border-accent focus:outline-none resize-none px-4 py-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 transition-colors"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim()}
              className={cn(
                "shrink-0 px-5 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-150",
                input.trim() && !isLoading
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>

          {/* Context bar */}
          {messages.length > 0 && (
            <div className="border-t border-border/20 px-4 py-2 flex items-center justify-between">
              <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                {messages.length} message{messages.length !== 1 ? "s" : ""} — GPT-4o mini
              </span>
              <button
                onClick={() => window.location.reload()}
                className="font-mono text-[10px] text-muted-foreground/50 hover:text-muted-foreground uppercase tracking-widest transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-border/30 p-5">
          <div className="flex-1">
            <p className="font-mono text-xs text-muted-foreground">
              Ready to talk to a human? Our team answers plant-specific questions directly.
            </p>
            <p className="font-mono text-[10px] text-muted-foreground/50 mt-1">
              {siteConfig.contact.email} &nbsp;&middot;&nbsp; {siteConfig.contact.phoneDisplay}
            </p>
          </div>
          <a
            href={siteConfig.calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCalendarClick("chat_section")}
            className="shrink-0 px-5 py-2.5 bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors"
          >
            Book a call
          </a>
        </div>
      </div>
    </section>
  )
}
