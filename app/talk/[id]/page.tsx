"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Mic, MicOff, Phone, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NotificationToast } from "@/components/notification-toast"
import { getKid } from "@/lib/store"
import { useAgora } from "@/lib/useAgora"
import { VOICES, DEFAULT_VOICE_ID } from "@/lib/voices"
import type { Kid } from "@/lib/types"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function TalkPage() {
  const params = useParams()
  const router = useRouter()
  const [kid, setKid] = useState<Kid | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [lastResponse, setLastResponse] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showNotification, setShowNotification] = useState(true)
  const [selectedVoice, setSelectedVoice] = useState(DEFAULT_VOICE_ID)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const handleSendRef = useRef<(text: string) => void>(() => {})

  // Agora for real-time voice channel
  // Use fixed channel name for demo (must match token's channel name)
  const agora = useAgora({ channelName: "koe-test" })

  useEffect(() => {
    const loadedKid = getKid(params.id as string)
    if (loadedKid) {
      setKid(loadedKid)
    } else {
      router.push("/")
    }
  }, [params.id, router])

  // Auto-join Agora channel when page loads
  useEffect(() => {
    if (kid && agora.hasAppId && !agora.isConnected && !agora.isConnecting) {
      agora.join()
    }
  }, [kid, agora])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "ja-JP"

        recognition.onresult = (event) => {
          const current = event.resultIndex
          const result = event.results[current]
          setTranscript(result[0].transcript)

          if (result.isFinal) {
            console.log("Final transcript:", result[0].transcript)
            handleSendRef.current(result[0].transcript)
          }
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setError(`音声認識エラー: ${event.error}`)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [])

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !kid) return

    setIsProcessing(true)
    setError(null)

    const newMessages: Message[] = [...messages, { role: "user", content: text }]
    setMessages(newMessages)

    try {
      const response = await fetch("/api/voice/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          kidName: kid.firstName,
          voiceId: selectedVoice,
          history: messages,
        }),
      })

      const data = await response.json()
      console.log("API response:", { text: data.text, hasAudio: !!data.audio, audioLength: data.audio?.length })

      if (data.error) {
        setError(data.error)
        return
      }

      setLastResponse(data.text)
      setMessages([...newMessages, { role: "assistant", content: data.text }])

      // Play audio response
      if (data.audio) {
        console.log("Playing audio...")
        playAudio(data.audio)
      } else {
        console.log("No audio in response")
      }
    } catch (err) {
      console.error("Chat error:", err)
      setError("通信エラーが発生しました")
    } finally {
      setIsProcessing(false)
      setTranscript("")
    }
  }, [kid, messages, selectedVoice])

  // Keep ref updated
  useEffect(() => {
    handleSendRef.current = handleSendMessage
  }, [handleSendMessage])

  const playAudio = (hexAudio: string) => {
    try {
      console.log("playAudio called, hex length:", hexAudio.length)
      setIsSpeaking(true)
      // Convert hex to binary
      const bytes = new Uint8Array(hexAudio.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))
      console.log("Converted to bytes:", bytes.length)
      const blob = new Blob([bytes], { type: "audio/mp3" })
      const audioUrl = URL.createObjectURL(blob)
      console.log("Audio URL created:", audioUrl)
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        console.log("Audio ended")
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl)
      }
      audio.onerror = (e) => {
        console.error("Audio playback error:", e)
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl)
      }

      audio.play().then(() => console.log("Audio playing")).catch(e => console.error("Play failed:", e))
    } catch (err) {
      console.error("Audio error:", err)
      setIsSpeaking(false)
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError("お使いのブラウザは音声認識に対応していません")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      setTranscript("")
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const endCall = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    // Leave Agora channel
    if (agora.isConnected) {
      await agora.leave()
    }
    if (audioRef.current) {
      audioRef.current.pause()
    }
    router.push("/")
  }

  if (!kid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDF8F4]">
        <div className="text-[#8B8B8B]">Loading...</div>
      </div>
    )
  }

  const getStatusText = () => {
    if (isProcessing) return "考え中..."
    if (isSpeaking) return "話しています..."
    if (isListening) return "聞いています..."
    return "マイクをタップして話しかけてください"
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FDF8F4]">
      {/* Smart Check-in Notification */}
      {showNotification && kid && (
        <NotificationToast
          kidName={kid.firstName}
          onClose={() => setShowNotification(false)}
        />
      )}

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
        <div className="flex items-center gap-2 text-sm">
          {agora.isConnected && (
            <span className="flex items-center gap-1 text-green-600">
              <span className="size-2 rounded-full bg-green-500 animate-pulse" />
              Agora
            </span>
          )}
          {agora.isConnecting && (
            <span className="text-yellow-600">Connecting...</span>
          )}
          <span className="text-[#8B8B8B]">
            {isProcessing ? "Processing..." : isSpeaking ? "Speaking..." : "Ready"}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {/* Avatar with animation */}
        <div className="relative mb-6">
          <div
            className={`flex size-36 items-center justify-center rounded-full bg-[#E8D4C4] text-7xl transition-all ${
              isSpeaking
                ? "ring-4 ring-[#C4775C] ring-offset-4 animate-pulse"
                : isListening
                ? "ring-4 ring-blue-400 ring-offset-4"
                : "ring-4 ring-[#D4C4B4] ring-offset-4"
            }`}
          >
            {kid.avatar}
          </div>
          {isSpeaking && (
            <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#C4775C] px-3 py-1 text-xs text-white">
              <Volume2 className="size-3" />
              Speaking
            </div>
          )}
        </div>

        <h1 className="mb-1 text-2xl font-bold text-[#2D2D2D]">{kid.firstName}</h1>
        <p className="mb-2 text-sm text-[#8B8B8B]">{getStatusText()}</p>

        {/* Voice Selector */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs text-[#8B8B8B]">🎤</span>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger className="w-48 rounded-xl border-[#E8D4C4] bg-white text-sm">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {VOICES.filter((v) => v.type === "custom").length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-[#C4775C]">
                    Custom Voices
                  </div>
                  {VOICES.filter((v) => v.type === "custom").map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      ⭐ {voice.nameJa}
                    </SelectItem>
                  ))}
                  <div className="my-1 border-t border-[#E8D4C4]" />
                </>
              )}
              <div className="px-2 py-1.5 text-xs font-semibold text-[#8B8B8B]">
                Preset Voices
              </div>
              {VOICES.filter((v) => v.type === "preset").map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.nameJa}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transcript display */}
        {transcript && (
          <div className="mb-4 rounded-xl bg-white px-4 py-2 text-sm text-[#2D2D2D] shadow">
            {transcript}
          </div>
        )}

        {/* Last response display */}
        {lastResponse && !isListening && !transcript && (
          <div className="mb-4 max-w-xs rounded-xl bg-[#C4775C]/10 px-4 py-3 text-center text-sm text-[#2D2D2D]">
            "{lastResponse}"
          </div>
        )}

        {/* Error display */}
        {(error || agora.error) && (
          <div className="mb-4 rounded-xl bg-red-100 px-4 py-2 text-sm text-red-600">
            {error || agora.error}
          </div>
        )}

        {/* Call Controls */}
        <div className="flex items-center gap-6">
          <Button
            onClick={toggleListening}
            disabled={isProcessing || isSpeaking}
            className={`size-20 rounded-full transition-all ${
              isListening
                ? "bg-blue-500 text-white animate-pulse"
                : "bg-[#C4775C] text-white hover:bg-[#B56A50]"
            } disabled:opacity-50`}
          >
            {isListening ? (
              <MicOff className="size-8" />
            ) : (
              <Mic className="size-8" />
            )}
          </Button>

          <Button
            onClick={endCall}
            className="size-16 rounded-full bg-red-500 text-white hover:bg-red-600"
          >
            <Phone className="size-7 rotate-[135deg]" />
          </Button>
        </div>

        {/* Instructions */}
        <p className="mt-8 text-center text-xs text-[#8B8B8B]">
          マイクボタンを押して話しかけてください
          <br />
          Tap the mic and speak in Japanese
        </p>
      </div>

      {/* Bottom Mode Bar */}
      <div className="border-t border-[#E8D4C4] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-md justify-between">
          {[
            { icon: "🧠", label: "Logic", path: "/exercise/logic" },
            { icon: "📊", label: "Analytic", path: "/exercise/analytic" },
            { icon: "🌐", label: "Language", path: "/exercise/language" },
            { icon: "🔚", label: "End", path: null },
          ].map((mode) => (
            <button
              key={mode.label}
              type="button"
              onClick={() => mode.path ? router.push(mode.path) : endCall()}
              className="flex items-center gap-1 rounded-full bg-[#2D2D2D] px-3 py-2 text-xs text-white transition-all hover:bg-[#4D4D4D]"
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
