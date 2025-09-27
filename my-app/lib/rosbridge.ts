"use client"

import { EventEmitter } from "events"

export interface RosMessage {
  op: string
  topic?: string
  type?: string
  msg?: any
  service?: string
  args?: any
  id?: string
  result?: boolean
  values?: any
}

export interface RosTopic {
  topic: string
  type: string
}

export interface RosService {
  service: string
  type: string
}

export class RosBridge extends EventEmitter {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isConnecting = false
  private messageId = 0

  constructor(url = "ws://localhost:9090") {
    super()
    this.url = url
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      if (this.isConnecting) {
        this.once("connected", resolve)
        this.once("error", reject)
        return
      }

      this.isConnecting = true

      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log("Connected to ROS bridge")
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.emit("connected")
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: RosMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error("Failed to parse ROS message:", error)
          }
        }

        this.ws.onclose = (event) => {
          console.log("Disconnected from ROS bridge:", event.code, event.reason)
          this.isConnecting = false
          this.emit("disconnected", event)

          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect()
          }
        }

        this.ws.onerror = (error) => {
          console.error("ROS bridge error:", error)
          this.isConnecting = false
          this.emit("error", error)
          reject(error)
        }
      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, "Manual disconnect")
      this.ws = null
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error("Reconnection failed:", error)
      })
    }, delay)
  }

  private handleMessage(message: RosMessage) {
    switch (message.op) {
      case "publish":
        this.emit("message", message.topic, message.msg)
        this.emit(`topic:${message.topic}`, message.msg)
        break
      case "service_response":
        this.emit(`service_response:${message.id}`, message)
        break
      case "call_service":
        this.emit("service_call", message.service, message.args)
        break
      default:
        this.emit("raw_message", message)
    }
  }

  private getNextId(): string {
    return `msg_${++this.messageId}`
  }

  private send(message: RosMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      throw new Error("ROS bridge not connected")
    }
  }

  // Subscribe to a topic
  subscribe(topic: string, type: string): void {
    this.send({
      op: "subscribe",
      topic,
      type,
    })
  }

  // Unsubscribe from a topic
  unsubscribe(topic: string): void {
    this.send({
      op: "unsubscribe",
      topic,
    })
  }

  // Publish to a topic
  publish(topic: string, type: string, message: any): void {
    this.send({
      op: "publish",
      topic,
      type,
      msg: message,
    })
  }

  // Call a service
  callService(service: string, type: string, args: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = this.getNextId()

      const timeout = setTimeout(() => {
        this.removeAllListeners(`service_response:${id}`)
        reject(new Error("Service call timeout"))
      }, 10000)

      this.once(`service_response:${id}`, (response: RosMessage) => {
        clearTimeout(timeout)
        if (response.result) {
          resolve(response.values)
        } else {
          reject(new Error("Service call failed"))
        }
      })

      this.send({
        op: "call_service",
        service,
        type,
        args,
        id,
      })
    })
  }

  // Get list of topics
  getTopics(): Promise<RosTopic[]> {
    return this.callService("/rosapi/topics", "rosapi/Topics").then((response) => response.topics || [])
  }

  // Get list of services
  getServices(): Promise<RosService[]> {
    return this.callService("/rosapi/services", "rosapi/Services").then((response) => response.services || [])
  }

  // Get topic type
  getTopicType(topic: string): Promise<string> {
    return this.callService("/rosapi/topic_type", "rosapi/TopicType", { topic }).then((response) => response.type)
  }

  // Get service type
  getServiceType(service: string): Promise<string> {
    return this.callService("/rosapi/service_type", "rosapi/ServiceType", { service }).then((response) => response.type)
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton instance
let rosBridgeInstance: RosBridge | null = null

export function getRosBridge(url?: string): RosBridge {
  if (!rosBridgeInstance) {
    rosBridgeInstance = new RosBridge(url)
  }
  return rosBridgeInstance
}
