"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Clock, Activity } from "lucide-react"
import { useState, useEffect } from "react"

interface NodeHealth {
  name: string
  status: "healthy" | "warning" | "error" | "unknown"
  uptime: number
  messageRate: number
  lastSeen: Date
  cpu: number
  memory: number
  errors: string[]
}

export function NodeHealthMonitor() {
  const [nodes, setNodes] = useState<NodeHealth[]>([])

  useEffect(() => {
    const nodeNames = [
      "kinova_driver",
      "joint_state_publisher",
      "robot_state_publisher",
      "move_group",
      "camera_driver",
      "vision_processor",
      "command_interface",
      "safety_monitor",
    ]

    const generateNodeHealth = (name: string): NodeHealth => {
      const statuses: NodeHealth["status"][] = ["healthy", "warning", "error", "unknown"]
      const status = statuses[Math.floor(Math.random() * statuses.length)]

      return {
        name,
        status,
        uptime: Math.floor(Math.random() * 86400), // 0-24 hours in seconds
        messageRate: Math.random() * 100,
        lastSeen: new Date(Date.now() - Math.random() * 60000), // Within last minute
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        errors: status === "error" ? ["Connection timeout", "Invalid message format"] : [],
      }
    }

    const updateNodes = () => {
      setNodes(nodeNames.map(generateNodeHealth))
    }

    updateNodes()
    const interval = setInterval(updateNodes, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: NodeHealth["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusVariant = (status: NodeHealth["status"]) => {
    switch (status) {
      case "healthy":
        return "default" as const
      case "warning":
        return "secondary" as const
      case "error":
        return "destructive" as const
      default:
        return "outline" as const
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  const healthyNodes = nodes.filter((n) => n.status === "healthy").length
  const warningNodes = nodes.filter((n) => n.status === "warning").length
  const errorNodes = nodes.filter((n) => n.status === "error").length

  return (
    <div className="space-y-6">
      {/* Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Node Health Overview
          </CardTitle>
          <CardDescription>Real-time monitoring of ROS node health and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{healthyNodes}</div>
              <div className="text-sm text-muted-foreground">Healthy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{warningNodes}</div>
              <div className="text-sm text-muted-foreground">Warning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{errorNodes}</div>
              <div className="text-sm text-muted-foreground">Error</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{nodes.length}</div>
              <div className="text-sm text-muted-foreground">Total Nodes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {errorNodes > 0 && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-destructive-foreground">
            {errorNodes} node{errorNodes > 1 ? "s" : ""} reporting errors. Check individual node status below.
          </AlertDescription>
        </Alert>
      )}

      {/* Node Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map((node) => (
          <Card key={node.name}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{node.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(node.status)}
                  <Badge variant={getStatusVariant(node.status)}>{node.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Uptime:</span>
                  <div className="text-muted-foreground">{formatUptime(node.uptime)}</div>
                </div>
                <div>
                  <span className="font-medium">Message Rate:</span>
                  <div className="text-muted-foreground">{node.messageRate.toFixed(1)} Hz</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span>{node.cpu.toFixed(1)}%</span>
                </div>
                <Progress value={node.cpu} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Memory Usage</span>
                  <span>{node.memory.toFixed(1)}%</span>
                </div>
                <Progress value={node.memory} className="h-2" />
              </div>

              {node.errors.length > 0 && (
                <div className="space-y-1">
                  <span className="text-sm font-medium text-destructive">Recent Errors:</span>
                  {node.errors.map((error, i) => (
                    <div key={i} className="text-xs text-destructive bg-destructive/10 p-1 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              )}

              <div className="text-xs text-muted-foreground">Last seen: {node.lastSeen.toLocaleTimeString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
