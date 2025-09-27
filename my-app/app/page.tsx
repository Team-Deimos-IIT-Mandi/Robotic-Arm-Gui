"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Square, AlertTriangle, Activity, Zap, FileText, Eye, Settings } from "lucide-react"
import { useProcessManager } from "@/hooks/use-process-manager"
import { RosStatusPanel } from "@/components/ros-status-panel"
import { LogViewer } from "@/components/log-viewer"
import { KinovaControlPanel } from "@/components/kinova/kinova-control-panel"

// ROS Process definitions
const ROS_PROCESSES = {
  roscore: {
    name: "ROS Core",
    description: "Core ROS master node",
    icon: Activity,
    category: "control",
  },
  kortex_driver: {
    name: "Kortex Driver", 
    description: "Main Kinova arm driver and control",
    icon: Activity,
    category: "control",
  },
  kinova_vision: {
    name: "Kinova Vision",
    description: "Camera drivers and vision processing", 
    icon: Zap,
    category: "sensors",
  },
  keyboard_control: {
    name: "Keyboard Control",
    description: "Manual keyboard control interface",
    icon: FileText,
    category: "control", 
  },
  image_viewer: {
    name: "Image Viewer",
    description: "RQT image visualization tool",
    icon: Zap,
    category: "visualization",
  },
  rosbridge: {
    name: "ROS Bridge",
    description: "WebSocket bridge for web interface",
    icon: Activity,
    category: "communication",
  },
  run_all_examples: {
    name: "All Examples",
    description: "Launch all Kortex examples",
    icon: Play,
    category: "control",
  },
  rviz: {
    name: "RViz",
    description: "3D visualization tool",
    icon: Eye,
    category: "visualization",
  },
  moveit_planning: {
    name: "MoveIt Planning",
    description: "Motion planning interface",
    icon: Settings,
    category: "control",
  },
}

// Keep the rest of your component exactly the same...
export default function RobotControlDashboard() {
  const { processes, loading, error, startProcess, stopProcess, startAll, stopAll, emergencyStop, refresh } =
    useProcessManager()

  const [systemStatus, setSystemStatus] = useState<"offline" | "partial" | "online">("offline")
  const [emergencyActive, setEmergencyActive] = useState(false)

  // Initialize process states
  useEffect(() => {
    const initialStates: Record<string, any> = {}
    Object.keys(ROS_PROCESSES).forEach((key) => {
      initialStates[key] = { status: "stopped" }
    })
    setSystemStatus("offline")
  }, [])

  // Calculate system status based on process states
  useEffect(() => {
    const processStates = Object.values(processes)
    const runningCount = processStates.filter((p) => p.status === "running").length
    const totalCount = processStates.length

    if (runningCount === 0) {
      setSystemStatus("offline")
    } else if (runningCount === totalCount) {
      setSystemStatus("online")
    } else {
      setSystemStatus("partial")
    }
  }, [processes])

  const handleEmergencyStop = async () => {
    setEmergencyActive(true)
    await emergencyStop()
    setTimeout(() => setEmergencyActive(false), 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500"
      case "starting":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case "online":
        return "text-green-400"
      case "partial":
        return "text-yellow-400"
      default:
        return "text-red-400"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 animate-spin" />
          <span>Loading process status...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Kinova Robot Control Dashboard</h1>
            <p className="text-muted-foreground mt-1">ROS1 Process Management & Real-time Monitoring</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={refresh} className="flex items-center gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              Refresh
            </Button>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getSystemStatusColor().replace("text-", "bg-")}`} />
              <span className={`font-medium ${getSystemStatusColor()}`}>
                System {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-destructive bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-destructive-foreground">{error}</AlertDescription>
          </Alert>
        )}

        {/* Emergency Stop Alert */}
        {emergencyActive && (
          <Alert className="border-destructive bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-destructive-foreground">
              Emergency stop activated! All processes are being terminated.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* ROS Status Panel */}
            <RosStatusPanel />

            {/* Master Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Master Controls
                </CardTitle>
                <CardDescription>Control all ROS processes simultaneously</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button onClick={startAll} className="flex items-center gap-2" disabled={emergencyActive}>
                    <Play className="h-4 w-4" />
                    Start All Systems
                  </Button>
                  <Button variant="secondary" onClick={stopAll} className="flex items-center gap-2">
                    <Square className="h-4 w-4" />
                    Stop All Systems
                  </Button>
                  <Separator orientation="vertical" className="h-8" />
                  <Button variant="destructive" onClick={handleEmergencyStop} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Emergency Stop
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Process Management Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {Object.entries(ROS_PROCESSES).map(([key, process]) => {
                const state = processes[key]
                const Icon = process.icon

                return (
                  <Card key={key} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{process.name}</CardTitle>
                            <CardDescription className="text-sm">{process.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(state?.status || "stopped")}`} />
                          <Badge variant={state?.status === "running" ? "default" : "secondary"}>
                            {state?.status || "stopped"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground font-mono bg-muted/20 p-2 rounded">
                        {state?.command || "Command not available"}
                      </div>

                      {state?.pid && (
                        <div className="flex gap-4 text-sm">
                          <span>
                            PID: <code className="font-mono">{state.pid}</code>
                          </span>
                          <span>
                            Uptime: <code className="font-mono">{state.uptime || 0}s</code>
                          </span>
                        </div>
                      )}

                      {state?.lastError && (
                        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                          Error: {state.lastError}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {state?.status === "running" ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => stopProcess(key)}
                            className="flex items-center gap-2"
                          >
                            <Square className="h-3 w-3" />
                            Stop
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => startProcess(key)}
                            disabled={state?.status === "starting" || emergencyActive}
                            className="flex items-center gap-2"
                          >
                            <Play className="h-3 w-3" />
                            {state?.status === "starting" ? "Starting..." : "Start"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            
            {/* Kinova Robot Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Kinova Robot Control
                </CardTitle>
                <CardDescription>Direct robot control and command interface</CardDescription>
              </CardHeader>
              <CardContent>
                <KinovaControlPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <LogViewer />
          </TabsContent>
        </Tabs>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Current ROS environment and connection status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">ROS Master:</span>
                <div className="text-muted-foreground">http://localhost:11311</div>
              </div>
              <div>
                <span className="font-medium">ROS Bridge:</span>
                <div className="text-muted-foreground">ws://localhost:9090</div>
              </div>
              <div>
                <span className="font-medium">Active Nodes:</span>
                <div className="text-muted-foreground">
                  {Object.values(processes).filter((p) => p.status === "running").length} /{" "}
                  {Object.keys(processes).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}