"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Shield, AlertTriangle, Activity, Lock, Unlock, StopCircle, CheckCircle, XCircle, Settings } from "lucide-react"
import { useState, useEffect } from "react"

interface SafetyLimit {
  name: string
  current: number
  limit: number
  unit: string
  status: "safe" | "warning" | "critical"
}

interface SafetyZone {
  name: string
  active: boolean
  violated: boolean
  description: string
}

export function SafetyMonitor() {
  const [emergencyStopActive, setEmergencyStopActive] = useState(false)
  const [safetyLimits, setSafetyLimits] = useState<SafetyLimit[]>([])
  const [safetyZones, setSafetyZones] = useState<SafetyZone[]>([])
  const [safetyEnabled, setSafetyEnabled] = useState(true)
  const [lastSafetyCheck, setLastSafetyCheck] = useState<Date>(new Date())
  const [safetyViolations, setSafetyViolations] = useState<string[]>([])

  useEffect(() => {
    // Initialize safety limits
    const limits: SafetyLimit[] = [
      { name: "Joint Velocity", current: 45, limit: 90, unit: "deg/s", status: "safe" },
      { name: "End Effector Force", current: 12, limit: 50, unit: "N", status: "safe" },
      { name: "Motor Temperature", current: 42, limit: 70, unit: "°C", status: "safe" },
      { name: "Joint Torque", current: 8, limit: 25, unit: "Nm", status: "safe" },
      { name: "Workspace Boundary", current: 0.8, limit: 1.0, unit: "m", status: "warning" },
      { name: "Collision Distance", current: 0.15, limit: 0.1, unit: "m", status: "critical" },
    ]

    const zones: SafetyZone[] = [
      { name: "Human Detection Zone", active: true, violated: false, description: "Area around robot base" },
      { name: "Workspace Boundary", active: true, violated: false, description: "Maximum reach limits" },
      { name: "Collision Avoidance", active: true, violated: true, description: "Object proximity detection" },
      { name: "Emergency Stop Zone", active: true, violated: false, description: "Physical e-stop coverage" },
    ]

    const updateSafetyData = () => {
      // Simulate dynamic safety data
      const updatedLimits = limits.map((limit) => {
        const variation = (Math.random() - 0.5) * 0.2
        const newCurrent = Math.max(0, limit.current + variation * limit.limit)

        let status: SafetyLimit["status"] = "safe"
        if (newCurrent > limit.limit * 0.9) status = "critical"
        else if (newCurrent > limit.limit * 0.7) status = "warning"

        return { ...limit, current: newCurrent, status }
      })

      const updatedZones = zones.map((zone) => ({
        ...zone,
        violated: Math.random() < 0.1, // 10% chance of violation
      }))

      setSafetyLimits(updatedLimits)
      setSafetyZones(updatedZones)
      setLastSafetyCheck(new Date())

      // Check for violations
      const violations: string[] = []
      updatedLimits.forEach((limit) => {
        if (limit.status === "critical") {
          violations.push(`${limit.name} exceeded limit: ${limit.current.toFixed(1)}${limit.unit}`)
        }
      })
      updatedZones.forEach((zone) => {
        if (zone.violated) {
          violations.push(`Safety zone violation: ${zone.name}`)
        }
      })
      setSafetyViolations(violations)
    }

    updateSafetyData()
    const interval = setInterval(updateSafetyData, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleEmergencyStop = () => {
    setEmergencyStopActive(true)
    // In real implementation, this would trigger ROS emergency stop
    setTimeout(() => setEmergencyStopActive(false), 5000)
  }

  const handleSafetyReset = () => {
    setSafetyViolations([])
    // In real implementation, this would reset safety systems
  }

  const getStatusIcon = (status: SafetyLimit["status"]) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: SafetyLimit["status"]) => {
    switch (status) {
      case "safe":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "critical":
        return "text-red-500"
    }
  }

  const getProgressColor = (status: SafetyLimit["status"]) => {
    switch (status) {
      case "safe":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "critical":
        return "bg-red-500"
    }
  }

  const criticalViolations = safetyViolations.length > 0
  const safetySystemHealthy = safetyEnabled && !criticalViolations && !emergencyStopActive

  return (
    <div className="space-y-6">
      {/* Safety System Status */}
      <Card className={criticalViolations ? "border-destructive" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className={`h-5 w-5 ${safetySystemHealthy ? "text-green-500" : "text-red-500"}`} />
              <CardTitle>Safety System Status</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={safetySystemHealthy ? "default" : "destructive"}>
                {safetySystemHealthy ? "SAFE" : "ALERT"}
              </Badge>
            </div>
          </div>
          <CardDescription>Real-time safety monitoring and emergency controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Safety System Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">Safety System</span>
              {safetyEnabled ? (
                <Unlock className="h-4 w-4 text-green-500" />
              ) : (
                <Lock className="h-4 w-4 text-red-500" />
              )}
            </div>
            <Switch checked={safetyEnabled} onCheckedChange={setSafetyEnabled} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Last Safety Check:</span>
            <span className="font-mono">{lastSafetyCheck.toLocaleTimeString()}</span>
          </div>

          {/* Emergency Controls */}
          <Separator />
          <div className="flex gap-4">
            <Button
              variant="destructive"
              onClick={handleEmergencyStop}
              disabled={emergencyStopActive}
              className="flex items-center gap-2"
            >
              <StopCircle className="h-4 w-4" />
              {emergencyStopActive ? "E-STOP ACTIVE" : "Emergency Stop"}
            </Button>

            {safetyViolations.length > 0 && (
              <Button variant="outline" onClick={handleSafetyReset} className="flex items-center gap-2 bg-transparent">
                <Shield className="h-4 w-4" />
                Reset Safety
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Safety Violations Alert */}
      {safetyViolations.length > 0 && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-destructive-foreground">
            <div className="font-medium mb-2">Safety Violations Detected:</div>
            <ul className="list-disc list-inside space-y-1">
              {safetyViolations.map((violation, i) => (
                <li key={i} className="text-sm">
                  {violation}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Emergency Stop Status */}
      {emergencyStopActive && (
        <Alert className="border-destructive bg-destructive/10">
          <StopCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive-foreground">
            <div className="font-medium">EMERGENCY STOP ACTIVATED</div>
            <div className="text-sm mt-1">All robot motion has been halted. System will auto-reset in 5 seconds.</div>
          </AlertDescription>
        </Alert>
      )}

      {/* Safety Limits Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Safety Limits
            </CardTitle>
            <CardDescription>Real-time monitoring of operational limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {safetyLimits.map((limit, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(limit.status)}
                    <span className="text-sm font-medium">{limit.name}</span>
                  </div>
                  <span className={`text-sm font-mono ${getStatusColor(limit.status)}`}>
                    {limit.current.toFixed(1)}/{limit.limit}
                    {limit.unit}
                  </span>
                </div>
                <Progress value={(limit.current / limit.limit) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Safety Zones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Safety Zones
            </CardTitle>
            <CardDescription>Workspace safety zone monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {safetyZones.map((zone, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {zone.violated ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <span className="font-medium">{zone.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{zone.description}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={zone.violated ? "destructive" : "default"}>
                    {zone.violated ? "VIOLATED" : "CLEAR"}
                  </Badge>
                  <Switch checked={zone.active} readOnly />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Safety Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Safety Configuration
          </CardTitle>
          <CardDescription>Configure safety parameters and thresholds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Emergency Stop Timeout:</span>
              <div className="text-muted-foreground">5 seconds</div>
            </div>
            <div>
              <span className="font-medium">Safety Check Frequency:</span>
              <div className="text-muted-foreground">100 Hz</div>
            </div>
            <div>
              <span className="font-medium">Collision Threshold:</span>
              <div className="text-muted-foreground">0.1 meters</div>
            </div>
            <div>
              <span className="font-medium">Max Joint Velocity:</span>
              <div className="text-muted-foreground">90 deg/s</div>
            </div>
            <div>
              <span className="font-medium">Force Limit:</span>
              <div className="text-muted-foreground">50 N</div>
            </div>
            <div>
              <span className="font-medium">Temperature Limit:</span>
              <div className="text-muted-foreground">70°C</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
