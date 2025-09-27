"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Camera, Play, Square, Send, Home, Hand, Eye, Settings, Gamepad2, MonitorPlay } from "lucide-react"

export function KinovaControlPanel() {
  const [textMessage, setTextMessage] = useState("v")
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [pose, setPose] = useState({ x: 0.5, y: 0, z: 0.5, rx: 0, ry: 0, rz: 0 })
  const [feedbackData, setFeedbackData] = useState<string>("")

  const sendRobotCommand = async (action: string, parameters?: any) => {
    setLoading(prev => ({ ...prev, [action]: true }))
    
    try {
      const response = await fetch("/api/robot/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, parameters })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error)
      }
      
      console.log("Command result:", result)
      
      // Update feedback for data retrieval commands
      if (action.includes("get_") || action.includes("echo")) {
        setFeedbackData(result.result || "No data received")
      }
      
    } catch (error) {
      console.error(`Command ${action} failed:`, error)
      alert(`Failed to execute ${action}: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(prev => ({ ...prev, [action]: false }))
    }
  }

  const sendTextMessage = () => {
    sendRobotCommand("send_text", { message: textMessage })
  }

  const moveToHome = () => {
    sendRobotCommand("home_position")
  }

  const moveToPose = () => {
    sendRobotCommand("move_to_pose", pose)
  }

  const emergencyStop = () => {
    sendRobotCommand("emergency_stop")
  }

  const openGripper = () => {
    sendRobotCommand("gripper_open")
  }

  const closeGripper = () => {
    sendRobotCommand("gripper_close")
  }

  const launchExamples = () => {
    sendRobotCommand("launch_examples")
  }

  const startKeyboardControl = () => {
    sendRobotCommand("keyboard_control")
  }

  const getJointStates = () => {
    sendRobotCommand("get_joint_states")
  }

  const getBaseFeedback = () => {
    sendRobotCommand("get_base_feedback")
  }

  const getCameraInfo = () => {
    sendRobotCommand("get_camera_info")
  }

  return (
    <div className="grid gap-6">
      {/* Quick Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Quick Controls
            </CardTitle>
            <CardDescription>Basic robot control commands</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={moveToHome} 
                disabled={loading.home_position}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                {loading.home_position ? "Moving..." : "Home"}
              </Button>
              <Button 
                onClick={emergencyStop} 
                variant="destructive"
                disabled={loading.emergency_stop}
                className="flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                {loading.emergency_stop ? "Stopping..." : "E-Stop"}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={openGripper} 
                disabled={loading.gripper_open}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Hand className="w-4 h-4" />
                {loading.gripper_open ? "Opening..." : "Open Gripper"}
              </Button>
              <Button 
                onClick={closeGripper} 
                disabled={loading.gripper_close}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                {loading.gripper_close ? "Closing..." : "Close Gripper"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Launch Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MonitorPlay className="w-5 h-5" />
              Launch Controls
            </CardTitle>
            <CardDescription>Start specialized robot programs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Button 
                onClick={launchExamples} 
                disabled={loading.launch_examples}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                {loading.launch_examples ? "Launching..." : "Launch All Examples"}
              </Button>
              <Button 
                onClick={startKeyboardControl} 
                disabled={loading.keyboard_control}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Gamepad2 className="w-4 h-4" />
                {loading.keyboard_control ? "Starting..." : "Keyboard Control"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Monitoring */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Robot Data
            </CardTitle>
            <CardDescription>Get real-time robot information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={getJointStates} 
                disabled={loading.get_joint_states}
                variant="outline"
                size="sm"
              >
                {loading.get_joint_states ? "Getting..." : "Joint States"}
              </Button>
              <Button 
                onClick={getBaseFeedback} 
                disabled={loading.get_base_feedback}
                variant="outline"
                size="sm"
              >
                {loading.get_base_feedback ? "Getting..." : "Base Feedback"}
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                onClick={getCameraInfo} 
                disabled={loading.get_camera_info}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                {loading.get_camera_info ? "Getting..." : "Camera Info"}
              </Button>
            </div>
            
            {feedbackData && (
              <div className="mt-4">
                <Label className="text-sm font-medium">Latest Data:</Label>
                <Textarea 
                  value={feedbackData}
                  readOnly
                  className="mt-2 text-xs font-mono"
                  rows={4}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Text Command */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Text Command
            </CardTitle>
            <CardDescription>Send text messages to robot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                placeholder="Enter command (e.g., 'v')"
                className="flex-1"
              />
              <Button 
                onClick={sendTextMessage}
                disabled={loading.send_text || !textMessage.trim()}
              >
                {loading.send_text ? "Sending..." : "Send"}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>Available topics:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>/annotated_keyboard</li>
                <li>/type_text</li>
                <li>/clicked_point</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Position Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Position Control
          </CardTitle>
          <CardDescription>Move robot to specific cartesian coordinates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm">X Position</Label>
              <Input
                type="number"
                step="0.01"
                value={pose.x}
                onChange={(e) => setPose(prev => ({ ...prev, x: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label className="text-sm">Y Position</Label>
              <Input
                type="number"
                step="0.01"
                value={pose.y}
                onChange={(e) => setPose(prev => ({ ...prev, y: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label className="text-sm">Z Position</Label>
              <Input
                type="number"
                step="0.01"
                value={pose.z}
                onChange={(e) => setPose(prev => ({ ...prev, z: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm">RX Rotation</Label>
              <Input
                type="number"
                step="0.1"
                value={pose.rx}
                onChange={(e) => setPose(prev => ({ ...prev, rx: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label className="text-sm">RY Rotation</Label>
              <Input
                type="number"
                step="0.1"
                value={pose.ry}
                onChange={(e) => setPose(prev => ({ ...prev, ry: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label className="text-sm">RZ Rotation</Label>
              <Input
                type="number"
                step="0.1"
                value={pose.rz}
                onChange={(e) => setPose(prev => ({ ...prev, rz: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <Button 
            onClick={moveToPose} 
            disabled={loading.move_to_pose}
            className="w-full"
          >
            {loading.move_to_pose ? "Moving..." : "Move to Position"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}