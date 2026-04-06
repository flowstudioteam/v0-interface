import { neon } from "@neondatabase/serverless"

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  return neon(process.env.DATABASE_URL)
}

let _sql: ReturnType<typeof neon> | null = null

export function getSql() {
  if (!_sql) {
    _sql = getDb()
  }
  return _sql
}
