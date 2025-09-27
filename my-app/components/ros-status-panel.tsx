"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Wifi, WifiOff, RefreshCw, Activity, Settings } from "lucide-react"
import { useRosConnection } from "@/hooks/use-ros-connection"

export function RosStatusPanel() {
  const { connected, connecting, error, lastHeartbeat, topics, services, connect, disconnect, refresh } =
    useRosConnection()

  const getConnectionStatus = () => {
    if (connecting) return { color: "bg-yellow-500", text: "Connecting", variant: "secondary" as const }
    if (connected) return { color: "bg-green-500", text: "Connected", variant: "default" as const }
    return { color: "bg-red-500", text: "Disconnected", variant: "destructive" as const }
  }

  const status = getConnectionStatus()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {connected ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
            <CardTitle>ROS Bridge Status</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status.color}`} />
            <Badge variant={status.variant}>{status.text}</Badge>
          </div>
        </div>
        <CardDescription>Real-time connection to ROS bridge server</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Bridge URL:</span>
            <div className="text-muted-foreground">ws://localhost:9090</div>
          </div>
          <div>
            <span className="font-medium">Last Heartbeat:</span>
            <div className="text-muted-foreground">{lastHeartbeat ? lastHeartbeat.toLocaleTimeString() : "Never"}</div>
          </div>
        </div>

        {/* Error Display */}
        {error && <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">Error: {error}</div>}

        {/* Connection Controls */}
        <div className="flex gap-2">
          {connected ? (
            <Button variant="secondary" size="sm" onClick={disconnect} className="flex items-center gap-2">
              <WifiOff className="h-3 w-3" />
              Disconnect
            </Button>
          ) : (
            <Button size="sm" onClick={connect} disabled={connecting} className="flex items-center gap-2">
              <Wifi className="h-3 w-3" />
              {connecting ? "Connecting..." : "Connect"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={!connected}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
        </div>

        <Separator />

        {/* Topics and Services */}
        {connected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4" />
                <span className="font-medium text-sm">Active Topics ({topics.length})</span>
              </div>
              <ScrollArea className="h-32 w-full border rounded p-2">
                <div className="space-y-1">
                  {topics.length > 0 ? (
                    topics.map((topic) => (
                      <div key={topic} className="text-xs font-mono text-muted-foreground">
                        {topic}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground">No topics available</div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4" />
                <span className="font-medium text-sm">Available Services ({services.length})</span>
              </div>
              <ScrollArea className="h-32 w-full border rounded p-2">
                <div className="space-y-1">
                  {services.length > 0 ? (
                    services.map((service) => (
                      <div key={service} className="text-xs font-mono text-muted-foreground">
                        {service}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground">No services available</div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
