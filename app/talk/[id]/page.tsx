"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Mic, MicOff, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getKid } from "@/lib/store"
import type { Kid } from "@/lib/types"

export default function TalkPage() {
  const params = useParams()
  const router = useRouter()
  const [kid, setKid] = useState<Kid | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "active">("idle")

  useEffect(() => {
    const loadedKid = getKid(params.id as string)
    if (loadedKid) {
      setKid(loadedKid)
    } else {
      router.push("/")
    }
  }, [params.id, router])

  const startCall = () => {
    setCallStatus("connecting")
    // TODO: Initialize Agora + MiniMax here
    setTimeout(() => setCallStatus("active"), 1500)
  }

  const endCall = () => {
    setCallStatus("idle")
    setIsListening(false)
    router.push("/")
  }

  if (!kid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDF8F4]">
        <div className="text-[#8B8B8B]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FDF8F4]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white shadow-sm"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="text-sm text-[#8B8B8B]">
          {callStatus === "active" ? "Connected" : callStatus === "connecting" ? "Connecting..." : "Ready"}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {/* Avatar with animation */}
        <div className="relative mb-8">
          <div
            className={`flex size-40 items-center justify-center rounded-full bg-[#E8D4C4] text-8xl transition-all ${
              callStatus === "active" && isListening
                ? "ring-4 ring-[#C4775C] ring-offset-4 animate-pulse"
                : "ring-4 ring-[#D4C4B4] ring-offset-4"
            }`}
          >
            {kid.avatar}
          </div>
          {callStatus === "active" && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-3 py-1 text-xs text-white">
              Live
            </div>
          )}
        </div>

        <h1 className="mb-2 text-3xl font-bold text-[#2D2D2D]">{kid.firstName}</h1>
        <p className="mb-8 text-[#8B8B8B]">
          {callStatus === "idle" && "Tap to start talking"}
          {callStatus === "connecting" && "Connecting to voice..."}
          {callStatus === "active" && (isListening ? "Listening..." : "Tap mic to speak")}
        </p>

        {/* Call Controls */}
        {callStatus === "idle" ? (
          <Button
            onClick={startCall}
            className="size-20 rounded-full bg-[#C4775C] text-white hover:bg-[#B56A50]"
          >
            <Mic className="size-8" />
          </Button>
        ) : (
          <div className="flex items-center gap-6">
            <Button
              onClick={() => setIsListening(!isListening)}
              className={`size-16 rounded-full transition-all ${
                isListening
                  ? "bg-[#C4775C] text-white"
                  : "bg-white text-[#2D2D2D] shadow-lg"
              }`}
            >
              {isListening ? <Mic className="size-7" /> : <MicOff className="size-7" />}
            </Button>

            <Button
              onClick={endCall}
              className="size-16 rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              <Phone className="size-7 rotate-[135deg]" />
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Mode Bar */}
      <div className="border-t border-[#E8D4C4] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-md justify-between">
          {[
            { icon: "①", label: "Logic Q", active: false },
            { icon: "②", label: "Analytic Q", active: false },
            { icon: "③", label: "Listening", active: false },
            { icon: "④", label: "Italian", active: false },
            { icon: "⑤", label: "End", active: false },
          ].map((mode) => (
            <button
              key={mode.label}
              type="button"
              onClick={() => mode.label === "End" && endCall()}
              className={`flex items-center gap-1 rounded-full px-3 py-2 text-xs transition-all ${
                mode.active
                  ? "bg-[#C4775C] text-white"
                  : "bg-[#2D2D2D] text-white hover:bg-[#4D4D4D]"
              }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
