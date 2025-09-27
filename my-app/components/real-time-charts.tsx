"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Activity, Cpu, HardDrive, Thermometer, Zap } from "lucide-react"
import { useState, useEffect } from "react"

interface SystemMetrics {
  timestamp: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  temperature: number
  networkLatency: number
}

interface RobotMetrics {
  timestamp: string
  jointPositions: number[]
  jointVelocities: number[]
  endEffectorPosition: { x: number; y: number; z: number }
  batteryLevel: number
  motorTemperatures: number[]
}

export function SystemMetricsChart() {
  const [metrics, setMetrics] = useState<SystemMetrics[]>([])
  const [currentMetrics, setCurrentMetrics] = useState<SystemMetrics | null>(null)

  useEffect(() => {
    const generateMetrics = (): SystemMetrics => ({
      timestamp: new Date().toLocaleTimeString(),
      cpuUsage: Math.random() * 100,
      memoryUsage: 60 + Math.random() * 30,
      diskUsage: 45 + Math.random() * 20,
      temperature: 35 + Math.random() * 25,
      networkLatency: 10 + Math.random() * 50,
    })

    const interval = setInterval(() => {
      const newMetric = generateMetrics()
      setCurrentMetrics(newMetric)
      setMetrics((prev) => [...prev.slice(-19), newMetric])
    }, 2000)

    // Initialize with some data
    const initialData = Array.from({ length: 20 }, () => generateMetrics())
    setMetrics(initialData)
    setCurrentMetrics(initialData[initialData.length - 1])

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "text-red-500"
    if (value >= thresholds.warning) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* System Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics?.cpuUsage.toFixed(1)}%</div>
            <div className={`text-xs ${getStatusColor(currentMetrics?.cpuUsage || 0, { warning: 70, critical: 90 })}`}>
              {currentMetrics?.cpuUsage && currentMetrics.cpuUsage > 90
                ? "Critical"
                : currentMetrics?.cpuUsage && currentMetrics.cpuUsage > 70
                  ? "Warning"
                  : "Normal"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Memory</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics?.memoryUsage.toFixed(1)}%</div>
            <div
              className={`text-xs ${getStatusColor(currentMetrics?.memoryUsage || 0, { warning: 80, critical: 95 })}`}
            >
              {currentMetrics?.memoryUsage && currentMetrics.memoryUsage > 95
                ? "Critical"
                : currentMetrics?.memoryUsage && currentMetrics.memoryUsage > 80
                  ? "Warning"
                  : "Normal"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics?.temperature.toFixed(1)}°C</div>
            <div
              className={`text-xs ${getStatusColor(currentMetrics?.temperature || 0, { warning: 50, critical: 70 })}`}
            >
              {currentMetrics?.temperature && currentMetrics.temperature > 70
                ? "Critical"
                : currentMetrics?.temperature && currentMetrics.temperature > 50
                  ? "Warning"
                  : "Normal"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Network</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics?.networkLatency.toFixed(0)}ms</div>
            <div
              className={`text-xs ${getStatusColor(currentMetrics?.networkLatency || 0, { warning: 100, critical: 200 })}`}
            >
              {currentMetrics?.networkLatency && currentMetrics.networkLatency > 200
                ? "Critical"
                : currentMetrics?.networkLatency && currentMetrics.networkLatency > 100
                  ? "Warning"
                  : "Normal"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
          <CardDescription>Real-time system resource monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="timestamp" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Line type="monotone" dataKey="cpuUsage" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="memoryUsage" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="temperature" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export function RobotMetricsChart() {
  const [robotMetrics, setRobotMetrics] = useState<RobotMetrics[]>([])
  const [currentRobotMetrics, setCurrentRobotMetrics] = useState<RobotMetrics | null>(null)

  useEffect(() => {
    const generateRobotMetrics = (): RobotMetrics => ({
      timestamp: new Date().toLocaleTimeString(),
      jointPositions: Array.from({ length: 6 }, () => Math.random() * 360 - 180),
      jointVelocities: Array.from({ length: 6 }, () => Math.random() * 2 - 1),
      endEffectorPosition: {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 1.5,
      },
      batteryLevel: 85 + Math.random() * 15,
      motorTemperatures: Array.from({ length: 6 }, () => 25 + Math.random() * 20),
    })

    const interval = setInterval(() => {
      const newMetric = generateRobotMetrics()
      setCurrentRobotMetrics(newMetric)
      setRobotMetrics((prev) => [...prev.slice(-19), newMetric])
    }, 1000)

    // Initialize with some data
    const initialData = Array.from({ length: 20 }, () => generateRobotMetrics())
    setRobotMetrics(initialData)
    setCurrentRobotMetrics(initialData[initialData.length - 1])

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Robot Status Cards */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Robot Status</CardTitle>
            <CardDescription>Current robot arm state and health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Battery Level</span>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span className="font-mono">{currentRobotMetrics?.batteryLevel.toFixed(1)}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">End Effector Position</span>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div>X: {currentRobotMetrics?.endEffectorPosition.x.toFixed(3)}</div>
                <div>Y: {currentRobotMetrics?.endEffectorPosition.y.toFixed(3)}</div>
                <div>Z: {currentRobotMetrics?.endEffectorPosition.z.toFixed(3)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Joint Positions (degrees)</span>
              <div className="grid grid-cols-3 gap-1 text-xs font-mono">
                {currentRobotMetrics?.jointPositions.map((pos, i) => (
                  <div key={i}>
                    J{i + 1}: {pos.toFixed(1)}°
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Joint Positions Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Joint Positions</CardTitle>
          <CardDescription>Real-time joint angle monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={robotMetrics}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="timestamp" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Area
                type="monotone"
                dataKey="jointPositions.0"
                stackId="1"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="jointPositions.1"
                stackId="2"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="jointPositions.2"
                stackId="3"
                stroke="hsl(var(--chart-3))"
                fill="hsl(var(--chart-3))"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
