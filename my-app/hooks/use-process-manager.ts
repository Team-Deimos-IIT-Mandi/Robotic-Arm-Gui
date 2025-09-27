"use client"

import { useState, useEffect, useCallback } from "react"

export type ProcessStatus = "stopped" | "starting" | "running" | "error"

export interface ProcessState {
  status: ProcessStatus
  pid?: number
  uptime?: number
  lastError?: string
  command?: string
}

export interface ProcessManagerState {
  processes: Record<string, ProcessState>
  loading: boolean
  error: string | null
}

export function useProcessManager() {
  const [state, setState] = useState<ProcessManagerState>({
    processes: {},
    loading: true,
    error: null,
  })

  // Fetch current process status
  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/processes")
      if (!response.ok) throw new Error("Failed to fetch process status")

      const data = await response.json()
      setState((prev) => ({
        ...prev,
        processes: data,
        loading: false,
        error: null,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }))
    }
  }, [])

  // Start a process
  const startProcess = useCallback(
    async (processKey: string) => {
      setState((prev) => ({
        ...prev,
        processes: {
          ...prev.processes,
          [processKey]: { ...prev.processes[processKey], status: "starting" },
        },
      }))

      try {
        const response = await fetch("/api/processes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "start", processKey }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to start process")
        }

        // Refresh status after starting
        setTimeout(fetchStatus, 1000)
      } catch (error) {
        setState((prev) => ({
          ...prev,
          processes: {
            ...prev.processes,
            [processKey]: {
              ...prev.processes[processKey],
              status: "error",
              lastError: error instanceof Error ? error.message : "Unknown error",
            },
          },
        }))
      }
    },
    [fetchStatus],
  )

  // Stop a process
  const stopProcess = useCallback(async (processKey: string) => {
    try {
      const response = await fetch("/api/processes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop", processKey }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to stop process")
      }

      setState((prev) => ({
        ...prev,
        processes: {
          ...prev.processes,
          [processKey]: { ...prev.processes[processKey], status: "stopped", pid: undefined, uptime: undefined },
        },
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
      }))
    }
  }, [])

  // Start all processes
  const startAll = useCallback(async () => {
    try {
      const response = await fetch("/api/processes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start-all" }),
      })

      if (!response.ok) throw new Error("Failed to start all processes")

      // Refresh status after batch operation
      setTimeout(fetchStatus, 2000)
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
      }))
    }
  }, [fetchStatus])

  // Stop all processes
  const stopAll = useCallback(async () => {
    try {
      const response = await fetch("/api/processes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop-all" }),
      })

      if (!response.ok) throw new Error("Failed to stop all processes")

      // Update all processes to stopped immediately
      setState((prev) => ({
        ...prev,
        processes: Object.fromEntries(
          Object.entries(prev.processes).map(([key, process]) => [
            key,
            { ...process, status: "stopped" as ProcessStatus, pid: undefined, uptime: undefined },
          ]),
        ),
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
      }))
    }
  }, [])

  // Emergency stop
  const emergencyStop = useCallback(async () => {
    try {
      const response = await fetch("/api/processes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "emergency-stop" }),
      })

      if (!response.ok) throw new Error("Emergency stop failed")

      // Update all processes to stopped immediately
      setState((prev) => ({
        ...prev,
        processes: Object.fromEntries(
          Object.entries(prev.processes).map(([key, process]) => [
            key,
            { ...process, status: "stopped" as ProcessStatus, pid: undefined, uptime: undefined },
          ]),
        ),
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
      }))
    }
  }, [])

  // Auto-refresh status every 5 seconds
  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000)
    return () => clearInterval(interval)
  }, [fetchStatus])

  return {
    ...state,
    startProcess,
    stopProcess,
    startAll,
    stopAll,
    emergencyStop,
    refresh: fetchStatus,
  }
}
