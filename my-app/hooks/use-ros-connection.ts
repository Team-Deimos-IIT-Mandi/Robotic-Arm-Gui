"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { getRosBridge, type RosBridge } from "@/lib/rosbridge"

interface RosConnectionState {
  connected: boolean
  connecting: boolean
  error: string | null
  lastHeartbeat: Date | null
  topics: string[]
  services: string[]
}

export function useRosConnection(url = "ws://localhost:9090") {
  const [state, setState] = useState<RosConnectionState>({
    connected: false,
    connecting: false,
    error: null,
    lastHeartbeat: null,
    topics: [],
    services: [],
  })

  const rosBridge = useRef<RosBridge | null>(null)
  const hasInitialized = useRef(false)

  const fetchTopicsAndServices = useCallback(async () => {
    if (!rosBridge.current?.isConnected) return

    try {
      const [topics, services] = await Promise.all([rosBridge.current.getTopics(), rosBridge.current.getServices()])

      setState((prev) => ({
        ...prev,
        topics: topics.map((t) => t.topic),
        services: services.map((s) => s.service),
      }))
    } catch (error) {
      console.error("Failed to fetch topics and services:", error)
    }
  }, [])

  const connect = useCallback(async () => {
    if (hasInitialized.current) return

    setState((prev) => ({ ...prev, connecting: true, error: null }))

    try {
      rosBridge.current = getRosBridge(url)

      // Set up event listeners
      rosBridge.current.on("connected", () => {
        setState((prev) => ({
          ...prev,
          connected: true,
          connecting: false,
          error: null,
          lastHeartbeat: new Date(),
        }))

        // Fetch available topics and services
        fetchTopicsAndServices()
      })

      rosBridge.current.on("disconnected", () => {
        setState((prev) => ({
          ...prev,
          connected: false,
          connecting: false,
          topics: [],
          services: [],
        }))
      })

      rosBridge.current.on("error", (error: Error) => {
        setState((prev) => ({
          ...prev,
          connected: false,
          connecting: false,
          error: error.message,
        }))
      })

      await rosBridge.current.connect()
      hasInitialized.current = true
    } catch (error) {
      setState((prev) => ({
        ...prev,
        connected: false,
        connecting: false,
        error: error instanceof Error ? error.message : "Connection failed",
      }))
    }
  }, [url, fetchTopicsAndServices])

  const disconnect = useCallback(() => {
    if (rosBridge.current) {
      rosBridge.current.disconnect()
      rosBridge.current = null
    }
    setState({
      connected: false,
      connecting: false,
      error: null,
      lastHeartbeat: null,
      topics: [],
      services: [],
    })
    hasInitialized.current = false
  }, [])

  useEffect(() => {
    if (!hasInitialized.current) {
      connect()
    }
    return () => {
      disconnect()
    }
  }, []) // Empty dependency array to run only once

  // Heartbeat simulation
  useEffect(() => {
    if (!state.connected) return

    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        lastHeartbeat: new Date(),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [state.connected])

  return {
    ...state,
    connect,
    disconnect,
    rosBridge: rosBridge.current,
    refresh: fetchTopicsAndServices,
  }
}
