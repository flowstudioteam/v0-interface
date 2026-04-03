"use client"

import { useEffect, useRef, useCallback } from "react"

// Stable session ID persisted in sessionStorage
function getSessionId(): string {
  if (typeof window === "undefined") return ""
  let id = sessionStorage.getItem("fs_session_id")
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
    sessionStorage.setItem("fs_session_id", id)
  }
  return id
}

function getUtmParams() {
  if (typeof window === "undefined") return {}
  const p = new URLSearchParams(window.location.search)
  return {
    utm_source: p.get("utm_source") ?? undefined,
    utm_medium: p.get("utm_medium") ?? undefined,
    utm_campaign: p.get("utm_campaign") ?? undefined,
  }
}

async function post(endpoint: string, body: object) {
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    })
  } catch {
    // Silent — tracking must never break UX
  }
}

// Hook used by VisitorTracker component
export function useVisitorTracker() {
  const sessionId = useRef<string>("")
  const tracked = useRef(false)

  useEffect(() => {
    sessionId.current = getSessionId()
    if (tracked.current) return
    tracked.current = true

    post("/api/track", {
      type: "visit",
      sessionId: sessionId.current,
      data: {
        page: window.location.pathname,
        ...getUtmParams(),
      },
    })
  }, [])

  const trackEvent = useCallback((event_type: string, metadata?: object, page_path?: string) => {
    post("/api/track", {
      type: "event",
      sessionId: sessionId.current,
      data: {
        event_type,
        page_path: page_path ?? window.location.pathname,
        metadata,
      },
    })
  }, [])

  const trackCalendarClick = useCallback((source: string) => {
    post("/api/track", {
      type: "calendar_click",
      sessionId: sessionId.current,
      data: { source, page_path: window.location.pathname },
    })
  }, [])

  return { sessionId: sessionId.current, trackEvent, trackCalendarClick }
}

// Standalone helpers for components that don't use the hook
export function trackCalendarClick(source: string) {
  const sessionId = getSessionId()
  post("/api/track", {
    type: "calendar_click",
    sessionId,
    data: { source, page_path: typeof window !== "undefined" ? window.location.pathname : "/" },
  })
}

export function trackEvent(event_type: string, metadata?: object) {
  const sessionId = getSessionId()
  post("/api/track", {
    type: "event",
    sessionId,
    data: {
      event_type,
      page_path: typeof window !== "undefined" ? window.location.pathname : "/",
      metadata,
    },
  })
}

export function getStoredSessionId() {
  return getSessionId()
}
