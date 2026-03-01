"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getKids } from "@/lib/store"
import type { Kid } from "@/lib/types"

export default function Home() {
  const router = useRouter()
  const [kids, setKids] = useState<Kid[]>([])
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null)

  useEffect(() => {
    const loadedKids = getKids()
    setKids(loadedKids)
    if (loadedKids.length > 0) {
      setSelectedKid(loadedKids[0])
    }
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "おはようございます"
    if (hour < 18) return "こんにちは"
    return "こんばんは"
  }

  const getTime = () => {
    return new Date().toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // No kids registered - show welcome screen
  if (kids.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDF8F4] px-6">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-[#C4775C]">Koe</h1>
          <p className="text-[#8B8B8B]">声 - Voice for your loved ones</p>
        </div>

        <Card className="mb-8 w-full max-w-sm border-0 bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-6xl">👨‍👩‍👧‍👦</div>
          <h2 className="mb-2 text-xl font-semibold text-[#2D2D2D]">
            Welcome to Koe
          </h2>
          <p className="mb-6 text-sm text-[#8B8B8B]">
            Add your first child to start connecting through voice
          </p>
          <Button
            onClick={() => router.push("/register")}
            className="w-full rounded-xl bg-[#C4775C] py-6 text-lg hover:bg-[#B56A50]"
          >
            <Plus className="mr-2 size-5" />
            Add a Kid
          </Button>
        </Card>
      </div>
    )
  }

  // Kids registered - show main interface
  return (
    <div className="flex min-h-screen flex-col bg-[#FDF8F4]">
      <div className="mx-auto w-full max-w-md flex-1 px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{getGreeting()}</span>
            <span className="text-2xl">😊</span>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Plus className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => router.push("/register")}
            >
              🔒
            </Button>
          </div>
          <span className="text-[#8B8B8B]">{getTime()}</span>
        </div>

        {/* Kid Selector (if multiple) */}
        {kids.length > 1 && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {kids.map((kid) => (
              <button
                key={kid.id}
                type="button"
                onClick={() => setSelectedKid(kid)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
                  selectedKid?.id === kid.id
                    ? "bg-[#C4775C] text-white"
                    : "bg-white text-[#2D2D2D]"
                }`}
              >
                <span>{kid.avatar}</span>
                <span>{kid.firstName}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-[#8B8B8B]"
            >
              <Plus className="size-4" />
            </button>
          </div>
        )}

        {/* Selected Kid Card */}
        {selectedKid && (
          <Card className="mb-8 border-0 bg-white p-8 text-center shadow-lg">
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="flex size-32 items-center justify-center rounded-full bg-[#E8D4C4] text-7xl ring-4 ring-[#D4C4B4] ring-offset-4">
                  {selectedKid.avatar}
                </div>
                <div className="absolute bottom-2 right-2 size-4 rounded-full bg-green-500 ring-2 ring-white" />
              </div>
            </div>

            <h2 className="mb-1 text-3xl font-bold text-[#2D2D2D]">
              {selectedKid.firstName}
            </h2>
            <p className="mb-6 text-[#8B8B8B]">Your son • Online now</p>

            <Button
              onClick={() => router.push(`/talk/${selectedKid.id}`)}
              className="w-full rounded-xl bg-[#C4775C] py-6 text-lg font-medium text-white hover:bg-[#B56A50]"
            >
              <Mic className="mr-2 size-5" />
              Talk to me
            </Button>
          </Card>
        )}

        {/* Add another kid button (single kid view) */}
        {kids.length === 1 && (
          <Button
            variant="outline"
            onClick={() => router.push("/register")}
            className="w-full rounded-xl border-dashed border-[#C4775C] py-6 text-[#C4775C] hover:bg-[#C4775C]/10"
          >
            <Plus className="mr-2 size-5" />
            Add another child
          </Button>
        )}
      </div>

      {/* Bottom Mode Bar */}
      <div className="border-t border-[#E8D4C4] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-md justify-between">
          {[
            { icon: "🧠", label: "Logic", path: "/exercise/logic" },
            { icon: "📊", label: "Analytic", path: "/exercise/analytic" },
            { icon: "🌐", label: "Language", path: "/exercise/language" },
          ].map((mode) => (
            <button
              key={mode.label}
              type="button"
              onClick={() => router.push(mode.path)}
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
