import { neon } from "@neondatabase/serverless"

export function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  // Create a fresh client each call - neon() is stateless HTTP-based
  return neon(process.env.DATABASE_URL)
}
