"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Save, Download, Upload, RotateCcw, Settings, Database, Network, Shield } from "lucide-react"
import { useState, useEffect } from "react"

interface ConfigSection {
  name: string
  description: string
  parameters: ConfigParameter[]
}

interface ConfigParameter {
  key: string
  value: any
  type: "string" | "number" | "boolean" | "array"
  description: string
  unit?: string
  min?: number
  max?: number
  options?: string[]
}

export function ConfigurationManager() {
  const [configurations, setConfigurations] = useState<ConfigSection[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [activeSection, setActiveSection] = useState("robot")

  useEffect(() => {
    // Initialize configuration sections
    const initialConfig: ConfigSection[] = [
      {
        name: "Robot Parameters",
        description: "Core robot configuration and limits",
        parameters: [
          {
            key: "max_joint_velocity",
            value: 90,
            type: "number",
            description: "Maximum joint velocity",
            unit: "deg/s",
            min: 1,
            max: 180,
          },
          {
            key: "max_joint_acceleration",
            value: 180,
            type: "number",
            description: "Maximum joint acceleration",
            unit: "deg/s²",
            min: 1,
            max: 360,
          },
          {
            key: "workspace_radius",
            value: 1.2,
            type: "number",
            description: "Maximum workspace radius",
            unit: "m",
            min: 0.5,
            max: 2.0,
          },
          {
            key: "collision_threshold",
            value: 0.1,
            type: "number",
            description: "Collision detection threshold",
            unit: "m",
            min: 0.01,
            max: 0.5,
          },
          {
            key: "enable_collision_detection",
            value: true,
            type: "boolean",
            description: "Enable collision detection system",
          },
          {
            key: "home_position",
            value: [0, 0, 0, 0, 0, 0],
            type: "array",
            description: "Default home joint positions",
          },
        ],
      },
      {
        name: "Safety Settings",
        description: "Safety system configuration and limits",
        parameters: [
          {
            key: "emergency_stop_timeout",
            value: 5,
            type: "number",
            description: "Emergency stop timeout",
            unit: "s",
            min: 1,
            max: 30,
          },
          {
            key: "force_limit",
            value: 50,
            type: "number",
            description: "Maximum end-effector force",
            unit: "N",
            min: 1,
            max: 100,
          },
          {
            key: "temperature_limit",
            value: 70,
            type: "number",
            description: "Motor temperature limit",
            unit: "°C",
            min: 40,
            max: 100,
          },
          { key: "safety_zones_enabled", value: true, type: "boolean", description: "Enable safety zone monitoring" },
          { key: "human_detection", value: true, type: "boolean", description: "Enable human presence detection" },
          {
            key: "safety_check_frequency",
            value: 100,
            type: "number",
            description: "Safety system check frequency",
            unit: "Hz",
            min: 10,
            max: 1000,
          },
        ],
      },
      {
        name: "Network Configuration",
        description: "ROS and network communication settings",
        parameters: [
          { key: "ros_master_uri", value: "http://localhost:11311", type: "string", description: "ROS Master URI" },
          {
            key: "rosbridge_port",
            value: 9090,
            type: "number",
            description: "ROSBridge WebSocket port",
            min: 1024,
            max: 65535,
          },
          {
            key: "update_rate",
            value: 50,
            type: "number",
            description: "Data update rate",
            unit: "Hz",
            min: 1,
            max: 200,
          },
          { key: "timeout", value: 10, type: "number", description: "Connection timeout", unit: "s", min: 1, max: 60 },
          { key: "auto_reconnect", value: true, type: "boolean", description: "Enable automatic reconnection" },
          {
            key: "log_level",
            value: "INFO",
            type: "string",
            description: "Logging level",
            options: ["DEBUG", "INFO", "WARN", "ERROR"],
          },
        ],
      },
      {
        name: "Vision System",
        description: "Camera and vision processing configuration",
        parameters: [
          {
            key: "camera_resolution",
            value: "1920x1080",
            type: "string",
            description: "Camera resolution",
            options: ["640x480", "1280x720", "1920x1080"],
          },
          {
            key: "frame_rate",
            value: 30,
            type: "number",
            description: "Camera frame rate",
            unit: "fps",
            min: 1,
            max: 60,
          },
          { key: "exposure", value: 50, type: "number", description: "Camera exposure", unit: "%", min: 1, max: 100 },
          { key: "enable_object_detection", value: true, type: "boolean", description: "Enable object detection" },
          {
            key: "detection_confidence",
            value: 0.8,
            type: "number",
            description: "Detection confidence threshold",
            min: 0.1,
            max: 1.0,
          },
        ],
      },
    ]
    setConfigurations(initialConfig)
  }, [])

  const updateParameter = (sectionName: string, paramKey: string, newValue: any) => {
    setConfigurations((prev) =>
      prev.map((section) =>
        section.name === sectionName
          ? {
              ...section,
              parameters: section.parameters.map((param) =>
                param.key === paramKey ? { ...param, value: newValue } : param,
              ),
            }
          : section,
      ),
    )
    setHasChanges(true)
  }

  const saveConfiguration = async () => {
    // In real implementation, this would save to ROS parameter server
    console.log("Saving configuration:", configurations)
    setHasChanges(false)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const exportConfiguration = () => {
    const configData = JSON.stringify(configurations, null, 2)
    const blob = new Blob([configData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `robot_config_${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const resetToDefaults = () => {
    // Reset all parameters to default values
    setHasChanges(true)
    // In real implementation, would load defaults from server
  }

  const renderParameter = (section: ConfigSection, param: ConfigParameter) => {
    switch (param.type) {
      case "boolean":
        return (
          <div className="flex items-center justify-between">
            <div>
              <Label>{param.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</Label>
              <div className="text-xs text-muted-foreground">{param.description}</div>
            </div>
            <Switch
              checked={param.value}
              onCheckedChange={(checked) => updateParameter(section.name, param.key, checked)}
            />
          </div>
        )

      case "number":
        return (
          <div className="space-y-2">
            <Label>{param.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={param.value}
                onChange={(e) => updateParameter(section.name, param.key, Number.parseFloat(e.target.value))}
                min={param.min}
                max={param.max}
                step={param.type === "number" && param.min && param.min < 1 ? 0.1 : 1}
              />
              {param.unit && <span className="text-sm text-muted-foreground">{param.unit}</span>}
            </div>
            <div className="text-xs text-muted-foreground">{param.description}</div>
            {param.min !== undefined && param.max !== undefined && (
              <div className="text-xs text-muted-foreground">
                Range: {param.min} - {param.max} {param.unit}
              </div>
            )}
          </div>
        )

      case "string":
        return (
          <div className="space-y-2">
            <Label>{param.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</Label>
            {param.options ? (
              <select
                value={param.value}
                onChange={(e) => updateParameter(section.name, param.key, e.target.value)}
                className="w-full p-2 border rounded"
              >
                {param.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <Input value={param.value} onChange={(e) => updateParameter(section.name, param.key, e.target.value)} />
            )}
            <div className="text-xs text-muted-foreground">{param.description}</div>
          </div>
        )

      case "array":
        return (
          <div className="space-y-2">
            <Label>{param.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</Label>
            <Textarea
              value={JSON.stringify(param.value)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  updateParameter(section.name, param.key, parsed)
                } catch (error) {
                  // Invalid JSON, don't update
                }
              }}
              rows={2}
            />
            <div className="text-xs text-muted-foreground">{param.description}</div>
          </div>
        )

      default:
        return null
    }
  }

  const getSectionIcon = (sectionName: string) => {
    if (sectionName.includes("Robot")) return <Settings className="h-4 w-4" />
    if (sectionName.includes("Safety")) return <Shield className="h-4 w-4" />
    if (sectionName.includes("Network")) return <Network className="h-4 w-4" />
    if (sectionName.includes("Vision")) return <Database className="h-4 w-4" />
    return <Settings className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration Manager
              </CardTitle>
              <CardDescription>Manage robot system configuration and parameters</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && <Badge variant="secondary">Unsaved Changes</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={saveConfiguration} disabled={!hasChanges} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
            <Button variant="outline" onClick={exportConfiguration} className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" onClick={resetToDefaults} className="flex items-center gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Sections */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid w-full grid-cols-4">
          {configurations.map((section, index) => (
            <TabsTrigger
              key={section.name}
              value={section.name.toLowerCase().replace(/\s+/g, "_")}
              className="flex items-center gap-2"
            >
              {getSectionIcon(section.name)}
              {section.name.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {configurations.map((section) => (
          <TabsContent key={section.name} value={section.name.toLowerCase().replace(/\s+/g, "_")}>
            <Card>
              <CardHeader>
                <CardTitle>{section.name}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96 w-full">
                  <div className="space-y-6">
                    {section.parameters.map((param, index) => (
                      <div key={param.key}>
                        {renderParameter(section, param)}
                        {index < section.parameters.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
