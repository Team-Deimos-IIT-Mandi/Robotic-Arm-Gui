import { type NextRequest, NextResponse } from "next/server"

// Store process logs in memory (in production, use proper logging system)
const processLogs = new Map<string, string[]>()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const processKey = searchParams.get("process")
  const lines = Number.parseInt(searchParams.get("lines") || "100")

  if (processKey) {
    const logs = processLogs.get(processKey) || []
    return NextResponse.json({
      processKey,
      logs: logs.slice(-lines),
    })
  }

  // Return all logs
  const allLogs: Record<string, string[]> = {}
  for (const [key, logs] of processLogs.entries()) {
    allLogs[key] = logs.slice(-lines)
  }

  return NextResponse.json(allLogs)
}

export async function POST(request: NextRequest) {
  const { processKey, message, level = "info" } = await request.json()

  if (!processKey || !message) {
    return NextResponse.json({ error: "Missing processKey or message" }, { status: 400 })
  }

  const timestamp = new Date().toISOString()
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`

  if (!processLogs.has(processKey)) {
    processLogs.set(processKey, [])
  }

  const logs = processLogs.get(processKey)!
  logs.push(logEntry)

  // Keep only last 1000 log entries per process
  if (logs.length > 1000) {
    logs.splice(0, logs.length - 1000)
  }

  return NextResponse.json({ success: true })
}
