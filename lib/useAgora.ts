"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng"

interface UseAgoraOptions {
  channelName: string
}

export function useAgora({ channelName }: UseAgoraOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clientRef = useRef<IAgoraRTCClient | null>(null)
  const audioTrackRef = useRef<IMicrophoneAudioTrack | null>(null)

  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID
  const token = process.env.NEXT_PUBLIC_AGORA_TOKEN || null

  const join = useCallback(async () => {
    if (!appId) {
      setError("Agora App ID not configured")
      return false
    }

    if (typeof window === "undefined") return false

    setIsConnecting(true)
    setError(null)

    try {
      // Dynamic import to avoid SSR issues
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default

      // Create client
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
      clientRef.current = client

      // Join channel with token (if configured)
      await client.join(appId, channelName, token, null)

      // Create and publish audio track
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
      audioTrackRef.current = audioTrack

      await client.publish([audioTrack])

      setIsConnected(true)
      setIsMicOn(true)
      console.log("Agora: Connected to channel", channelName)

      return true
    } catch (err) {
      console.error("Agora join error:", err)
      setError(err instanceof Error ? err.message : "Failed to connect")
      return false
    } finally {
      setIsConnecting(false)
    }
  }, [appId, channelName])

  const leave = useCallback(async () => {
    try {
      if (audioTrackRef.current) {
        audioTrackRef.current.close()
        audioTrackRef.current = null
      }

      if (clientRef.current) {
        await clientRef.current.leave()
        clientRef.current = null
      }

      setIsConnected(false)
      setIsMicOn(false)
      console.log("Agora: Left channel")
    } catch (err) {
      console.error("Agora leave error:", err)
    }
  }, [])

  const toggleMic = useCallback(async () => {
    if (audioTrackRef.current) {
      const newState = !isMicOn
      await audioTrackRef.current.setEnabled(newState)
      setIsMicOn(newState)
    }
  }, [isMicOn])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        leave()
      }
    }
  }, [leave])

  return {
    isConnected,
    isConnecting,
    isMicOn,
    error,
    join,
    leave,
    toggleMic,
    hasAppId: !!appId,
  }
}
