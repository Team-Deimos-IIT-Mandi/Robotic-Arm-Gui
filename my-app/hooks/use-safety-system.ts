"use client"

import { useState, useEffect, useCallback } from "react"

export interface SafetyState {
  emergencyStopActive: boolean
  safetyEnabled: boolean
  violations: string[]
  lastCheck: Date
  systemHealthy: boolean
}

export function useSafetySystem() {
  const [state, setState] = useState<SafetyState>({
    emergencyStopActive: false,
    safetyEnabled: true,
    violations: [],
    lastCheck: new Date(),
    systemHealthy: true,
  })

  const triggerEmergencyStop = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      emergencyStopActive: true,
      systemHealthy: false,
    }))

    try {
      // In real implementation, this would call ROS emergency stop service
      const response = await fetch("/api/safety/emergency-stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "activate" }),
      })

      if (!response.ok) {
        throw new Error("Failed to activate emergency stop")
      }

      // Auto-reset after 5 seconds
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          emergencyStopActive: false,
          systemHealthy: prev.violations.length === 0,
        }))
      }, 5000)
    } catch (error) {
      console.error("Emergency stop failed:", error)
    }
  }, [])

  const resetSafety = useCallback(async () => {
    try {
      const response = await fetch("/api/safety/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Failed to reset safety system")
      }

      setState((prev) => ({
        ...prev,
        violations: [],
        systemHealthy: true,
      }))
    } catch (error) {
      console.error("Safety reset failed:", error)
    }
  }, [])

  const toggleSafetySystem = useCallback((enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      safetyEnabled: enabled,
      systemHealthy: enabled && prev.violations.length === 0 && !prev.emergencyStopActive,
    }))
  }, [])

  // Monitor safety violations
  useEffect(() => {
    const checkSafety = () => {
      setState((prev) => ({
        ...prev,
        lastCheck: new Date(),
      }))
    }

    const interval = setInterval(checkSafety, 1000)
    return () => clearInterval(interval)
  }, [])

  return {
    ...state,
    triggerEmergencyStop,
    resetSafety,
    toggleSafetySystem,
  }
}
