"use client"

import { useVisitorTracker } from "@/lib/use-tracker"

// Mounts silently at root layout level to fire the initial visit event
export default function VisitorTracker() {
  useVisitorTracker()
  return null
}
