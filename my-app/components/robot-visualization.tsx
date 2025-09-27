"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Box, Move3D, RotateCcw, Target, Zap, Play, Square } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface JointState {
  name: string
  position: number
  velocity: number
  effort: number
  limits: { min: number; max: number }
}

interface EndEffectorPose {
  position: { x: number; y: number; z: number }
  orientation: { roll: number; pitch: number; yaw: number }
}

export function RobotVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [joints, setJoints] = useState<JointState[]>([])
  const [endEffectorPose, setEndEffectorPose] = useState<EndEffectorPose>({
    position: { x: 0.5, y: 0.0, z: 0.3 },
    orientation: { roll: 0, pitch: 0, yaw: 0 },
  })
  const [isMoving, setIsMoving] = useState(false)
  const [showWorkspace, setShowWorkspace] = useState(true)
  const [showTrajectory, setShowTrajectory] = useState(false)

  useEffect(() => {
    // Initialize joint states for 6-DOF Kinova arm
    const initialJoints: JointState[] = [
      { name: "Joint 1", position: 0, velocity: 0, effort: 0, limits: { min: -180, max: 180 } },
      { name: "Joint 2", position: 0, velocity: 0, effort: 0, limits: { min: -90, max: 90 } },
      { name: "Joint 3", position: 0, velocity: 0, effort: 0, limits: { min: -180, max: 180 } },
      { name: "Joint 4", position: 0, velocity: 0, effort: 0, limits: { min: -90, max: 90 } },
      { name: "Joint 5", position: 0, velocity: 0, effort: 0, limits: { min: -180, max: 180 } },
      { name: "Joint 6", position: 0, velocity: 0, effort: 0, limits: { min: -180, max: 180 } },
    ]
    setJoints(initialJoints)

    // Simulate joint movement
    const interval = setInterval(() => {
      if (isMoving) {
        setJoints((prev) =>
          prev.map((joint) => ({
            ...joint,
            position: joint.position + (Math.random() - 0.5) * 2,
            velocity: (Math.random() - 0.5) * 10,
            effort: Math.random() * 5,
          })),
        )
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isMoving])

  // Simple 2D robot arm visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up coordinate system (center of canvas)
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const scale = 80

    // Draw workspace boundary
    if (showWorkspace) {
      ctx.strokeStyle = "#6366f1"
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.arc(centerX, centerY, scale * 1.2, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw robot base
    ctx.fillStyle = "#374151"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI)
    ctx.fill()

    // Draw robot arm segments
    let currentX = centerX
    let currentY = centerY
    let currentAngle = 0

    const linkLengths = [0.3, 0.4, 0.3, 0.2, 0.15, 0.1] // Normalized link lengths

    ctx.strokeStyle = "#6366f1"
    ctx.lineWidth = 8

    for (let i = 0; i < Math.min(joints.length, linkLengths.length); i++) {
      const joint = joints[i]
      const linkLength = linkLengths[i] * scale

      // Calculate joint angle (convert degrees to radians)
      currentAngle += (joint.position * Math.PI) / 180

      const nextX = currentX + linkLength * Math.cos(currentAngle)
      const nextY = currentY + linkLength * Math.sin(currentAngle)

      // Draw link
      ctx.beginPath()
      ctx.moveTo(currentX, currentY)
      ctx.lineTo(nextX, nextY)
      ctx.stroke()

      // Draw joint
      ctx.fillStyle = joint.effort > 3 ? "#ef4444" : "#10b981"
      ctx.beginPath()
      ctx.arc(currentX, currentY, 6, 0, 2 * Math.PI)
      ctx.fill()

      currentX = nextX
      currentY = nextY
    }

    // Draw end effector
    ctx.fillStyle = "#f59e0b"
    ctx.beginPath()
    ctx.arc(currentX, currentY, 8, 0, 2 * Math.PI)
    ctx.fill()

    // Draw trajectory if enabled
    if (showTrajectory) {
      ctx.strokeStyle = "#ef4444"
      ctx.setLineDash([3, 3])
      ctx.lineWidth = 2
      // Simple trajectory visualization (could be enhanced with actual path data)
      ctx.beginPath()
      ctx.arc(centerX, centerY, scale * 0.8, 0, Math.PI)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }, [joints, showWorkspace, showTrajectory])

  const handleJointChange = (index: number, value: number[]) => {
    setJoints((prev) => prev.map((joint, i) => (i === index ? { ...joint, position: value[0] } : joint)))
  }

  const homePosition = () => {
    setJoints((prev) => prev.map((joint) => ({ ...joint, position: 0 })))
  }

  const randomPosition = () => {
    setJoints((prev) =>
      prev.map((joint) => ({
        ...joint,
        position: Math.random() * (joint.limits.max - joint.limits.min) + joint.limits.min,
      })),
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 3D Visualization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                Robot Visualization
              </CardTitle>
              <CardDescription>Real-time 3D robot arm visualization</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isMoving ? "default" : "secondary"}>{isMoving ? "Moving" : "Stopped"}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <canvas ref={canvasRef} width={400} height={300} className="border rounded-lg bg-muted/20 w-full" />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWorkspace(!showWorkspace)}
                className={showWorkspace ? "bg-primary/10" : ""}
              >
                Workspace
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTrajectory(!showTrajectory)}
                className={showTrajectory ? "bg-primary/10" : ""}
              >
                Trajectory
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMoving(!isMoving)}
              className="flex items-center gap-2"
            >
              {isMoving ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {isMoving ? "Stop" : "Animate"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={homePosition}
              className="flex items-center gap-2 bg-transparent"
            >
              <Target className="h-3 w-3" />
              Home
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={randomPosition}
              className="flex items-center gap-2 bg-transparent"
            >
              <RotateCcw className="h-3 w-3" />
              Random
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Joint Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Move3D className="h-5 w-5" />
            Joint Control
          </CardTitle>
          <CardDescription>Manual joint position control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {joints.map((joint, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{joint.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono">{joint.position.toFixed(1)}°</span>
                  {joint.effort > 3 && <Zap className="h-3 w-3 text-red-500" />}
                </div>
              </div>
              <Slider
                value={[joint.position]}
                onValueChange={(value) => handleJointChange(index, value)}
                min={joint.limits.min}
                max={joint.limits.max}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{joint.limits.min}°</span>
                <span>{joint.limits.max}°</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
