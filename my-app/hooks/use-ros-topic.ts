"use client"

import { useState, useEffect, useCallback } from "react"
import { useRosConnection } from "./use-ros-connection"

interface RosTopicState<T = any> {
  data: T | null
  lastMessage: Date | null
  messageCount: number
  error: string | null
}

export function useRosTopic<T = any>(topic: string, messageType: string) {
  const { rosBridge, connected } = useRosConnection()
  const [state, setState] = useState<RosTopicState<T>>({
    data: null,
    lastMessage: null,
    messageCount: 0,
    error: null,
  })

  const subscribe = useCallback(() => {
    if (!rosBridge || !connected) return

    try {
      rosBridge.subscribe(topic, messageType)

      const handleMessage = (message: T) => {
        setState((prev) => ({
          ...prev,
          data: message,
          lastMessage: new Date(),
          messageCount: prev.messageCount + 1,
          error: null,
        }))
      }

      rosBridge.on(`topic:${topic}`, handleMessage)

      return () => {
        rosBridge.off(`topic:${topic}`, handleMessage)
        rosBridge.unsubscribe(topic)
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Subscription failed",
      }))
    }
  }, [rosBridge, connected, topic, messageType])

  const publish = useCallback(
    (message: T) => {
      if (!rosBridge || !connected) {
        throw new Error("ROS bridge not connected")
      }

      rosBridge.publish(topic, messageType, message)
    },
    [rosBridge, connected, topic, messageType],
  )

  useEffect(() => {
    const cleanup = subscribe()
    return cleanup
  }, [subscribe])

  return {
    ...state,
    publish,
    subscribe,
  }
}
