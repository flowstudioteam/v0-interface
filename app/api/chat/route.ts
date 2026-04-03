import { NextRequest } from "next/server"
import { sql } from "@/lib/db"

export const maxDuration = 30

type Message = { role: "user" | "assistant" | "system"; content: string }

const SYSTEM_PROMPT = `You are the FlowStudio AI assistant — an expert on AI applications in Indian manufacturing for small and medium businesses (SMBs/MSMEs).

FlowStudio builds and deploys deep workflow-specific AI agents for manufacturing SMBs in India, focusing on production control, predictive maintenance, quality control, and planning. Unlike generic SaaS vendors, FlowStudio installs AI agents that integrate directly into plant operations.

When answering:
- Be specific and data-backed with Indian manufacturing context
- Reference: WEF AI Playbook for India SMEs (2025), Deloitte Smart Manufacturing Survey, NASSCOM AI Adoption Index, EY-CII reports
- Use concrete ROI numbers: "72% downtime reduction", "₹8 Cr saved annually"
- Acknowledge real MSME barriers: cost sensitivity, data in Excel/Tally, limited digital infrastructure
- Be honest about timelines — 6–12 weeks for first results
- Mention FlowStudio's free plant audit: team@theraidflowstudio.co.in or +91 866 942 7514
- Keep answers concise and practical for busy plant owners

Key facts:
- India has 63+ million MSMEs, 30% of GDP
- WEF: $490–685 billion untapped AI value for Indian SMEs
- MSME AI adoption: ~8% vs 23% for large enterprises
- Predictive maintenance payback: 6–12 months
- Computer vision quality inspection: 60–90% defect escape rate reduction
- India AI market: 25–35% CAGR
- IndiaAI Mission: ₹10,300 Cr allocated`

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId }: { messages: Message[]; sessionId?: string } = await req.json()

    const apiKey = process.env.ZAI_API_KEY
    if (!apiKey) {
      return new Response(
        `0:"AI service not configured. Please add your ZAI_API_KEY in project settings."\n`,
        { status: 200, headers: { "Content-Type": "text/plain" } }
      )
    }

    // Log user message (fire-and-forget)
    const lastUser = [...messages].reverse().find((m) => m.role === "user")
    if (lastUser && sessionId) {
      sql`INSERT INTO chat_interactions (session_id, role, content)
          VALUES (${sessionId}, 'user', ${lastUser.content.slice(0, 2000)})`.catch(() => {})
    }

    // ZAI is OpenAI-compatible — only the base URL and model differ
    const zaiRes = await fetch("https://api.zai.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "zai-1",
        stream: true,
        max_tokens: 600,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
      signal: req.signal,
    })

    if (!zaiRes.ok) {
      const err = await zaiRes.text()
      console.error("[chat] ZAI error:", err)
      return new Response(
        `0:"Sorry, the AI service is temporarily unavailable. Please try again."\n`,
        { status: 200, headers: { "Content-Type": "text/plain" } }
      )
    }

    const providerRes = zaiRes

    // Stream ZAI SSE → client in AI SDK data-stream format ("0:..." lines)
    let fullText = ""
    const stream = new ReadableStream({
      async start(controller) {
        const reader = providerRes.body!.getReader()
        const decoder = new TextDecoder()
        let buf = ""

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buf += decoder.decode(value, { stream: true })

            const lines = buf.split("\n")
            buf = lines.pop() ?? ""

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed || trimmed === "data: [DONE]") continue
              if (!trimmed.startsWith("data: ")) continue

              try {
                const parsed = JSON.parse(trimmed.slice(6))
                const delta = parsed.choices?.[0]?.delta?.content
                if (delta) {
                  fullText += delta
                  // Emit in AI SDK data-stream format so the client parser works
                  const chunk = `0:${JSON.stringify(delta)}\n`
                  controller.enqueue(new TextEncoder().encode(chunk))
                }
              } catch {
                // skip malformed chunk
              }
            }
          }
        } finally {
          controller.close()
          // Log assistant reply
          if (sessionId && fullText) {
            sql`INSERT INTO chat_interactions (session_id, role, content)
                VALUES (${sessionId}, 'assistant', ${fullText.slice(0, 2000)})`.catch(() => {})
          }
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Accel-Buffering": "no",
        "Cache-Control": "no-cache",
      },
    })
  } catch (err) {
    console.error("[chat] error:", err)
    return new Response(`0:"An error occurred. Please try again."\n`, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    })
  }
}
