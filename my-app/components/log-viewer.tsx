"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Trash2, Download, Search } from "lucide-react"
import { useState, useEffect, useMemo } from "react"

interface LogEntry {
  id: string
  timestamp: Date
  level: "info" | "warn" | "error" | "debug"
  source: string
  message: string
}

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filterLevel, setFilterLevel] = useState<string>("all")
  const [filterSource, setFilterSource] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [autoScroll, setAutoScroll] = useState(true)

  // Generate mock log entries
  useEffect(() => {
    const sources = ["robot_driver", "vision_system", "command_interface", "rqt_view", "rosbridge"]
    const levels: LogEntry["level"][] = ["info", "warn", "error", "debug"]

    const messages = {
      info: [
        "Node started successfully",
        "Connection established",
        "Joint state updated",
        "Command executed",
        "System ready",
      ],
      warn: ["High CPU usage detected", "Network latency increased", "Joint limit approaching", "Temperature warning"],
      error: ["Connection lost", "Command failed", "Joint limit exceeded", "Emergency stop triggered"],
      debug: ["Processing joint command", "Updating transform", "Received sensor data", "Publishing state"],
    }

    const generateLog = (): LogEntry => {
      const level = levels[Math.floor(Math.random() * levels.length)]
      const source = sources[Math.floor(Math.random() * sources.length)]
      const messageList = messages[level]
      const message = messageList[Math.floor(Math.random() * messageList.length)]

      return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        level,
        source,
        message,
      }
    }

    // Initialize with some logs
    const initialLogs = Array.from({ length: 50 }, () => generateLog())
    setLogs(initialLogs)

    // Add new logs periodically
    const interval = setInterval(() => {
      const newLog = generateLog()
      setLogs((prev) => [...prev.slice(-199), newLog]) // Keep last 200 logs
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const levelMatch = filterLevel === "all" || log.level === filterLevel
      const sourceMatch = filterSource === "all" || log.source === filterSource
      const searchMatch =
        searchTerm === "" ||
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase())

      return levelMatch && sourceMatch && searchMatch
    })
  }, [logs, filterLevel, filterSource, searchTerm])

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "bg-red-500"
      case "warn":
        return "bg-yellow-500"
      case "info":
        return "bg-blue-500"
      case "debug":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getLevelVariant = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "destructive" as const
      case "warn":
        return "secondary" as const
      case "info":
        return "default" as const
      case "debug":
        return "outline" as const
      default:
        return "outline" as const
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  const exportLogs = () => {
    const logText = filteredLogs
      .map((log) => `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] [${log.source}] ${log.message}`)
      .join("\n")

    const blob = new Blob([logText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ros_logs_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const uniqueSources = Array.from(new Set(logs.map((log) => log.source)))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>Real-time log monitoring and filtering</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{filteredLogs.length} entries</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
          </div>

          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warn">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {uniqueSources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={exportLogs} className="flex items-center gap-2 bg-transparent">
              <Download className="h-3 w-3" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={clearLogs} className="flex items-center gap-2 bg-transparent">
              <Trash2 className="h-3 w-3" />
              Clear
            </Button>
          </div>
        </div>

        {/* Log Display */}
        <ScrollArea className="h-96 w-full border rounded-md p-4">
          <div className="space-y-2">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-sm font-mono">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${getLevelColor(log.level)}`} />
                    <Badge variant={getLevelVariant(log.level)} className="text-xs">
                      {log.level.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground min-w-0">{log.timestamp.toLocaleTimeString()}</div>
                  <div className="text-primary min-w-0">[{log.source}]</div>
                  <div className="flex-1 min-w-0 break-words">{log.message}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">No logs match the current filters</div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
