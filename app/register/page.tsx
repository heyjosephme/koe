"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { saveKid } from "@/lib/store"
import { AVATARS, type Kid } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function RegisterPage() {
  const router = useRouter()
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const handleSubmit = () => {
    if (!firstName.trim()) return

    const kid: Kid = {
      id: crypto.randomUUID(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      avatar: selectedAvatar,
      email: email.trim(),
      phone: phone.trim(),
      createdAt: Date.now(),
    }

    saveKid(kid)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#FDF8F4]">
      <div className="mx-auto max-w-md px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white shadow-sm"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <span className="rounded-full bg-[#E8B4A0]/20 px-3 py-1 text-xs font-medium text-[#C4775C]">
            REGISTRATION
          </span>
        </div>

        <h1 className="mb-6 text-2xl font-bold text-[#2D2D2D]">Add a Kid</h1>

        {/* Tabs */}
        <div className="mb-8 flex gap-2">
          <Button className="rounded-lg bg-[#C4775C] text-white hover:bg-[#B56A50]">
            <span className="mr-1">👤</span> New
          </Button>
          <Button variant="outline" className="rounded-lg" disabled>
            +
          </Button>
          <Button variant="outline" className="rounded-lg" disabled>
            🔒
          </Button>
        </div>

        {/* Avatar Selection */}
        <Card className="mb-6 border-0 bg-[#F5EDE8] p-6 shadow-none">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <div className="flex size-24 items-center justify-center rounded-full bg-[#E8D4C4] text-5xl">
                {selectedAvatar}
              </div>
              <div className="absolute -right-1 bottom-0 flex size-7 items-center justify-center rounded-full bg-[#C4775C] text-white text-xs">
                ✏️
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {AVATARS.map((avatar) => (
              <button
                key={avatar}
                type="button"
                onClick={() => setSelectedAvatar(avatar)}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full text-2xl transition-all",
                  selectedAvatar === avatar
                    ? "ring-2 ring-[#C4775C] ring-offset-2"
                    : "hover:bg-[#E8D4C4]"
                )}
              >
                {avatar}
              </button>
            ))}
          </div>
        </Card>

        {/* Name Fields */}
        <div className="mb-6 space-y-4">
          <div className="text-xs font-medium text-[#8B8B8B]">NAME</div>
          <div className="flex gap-3">
            <Input
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-xl border-[#E8D4C4] bg-white py-6"
            />
            <Input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-xl border-[#E8D4C4] bg-white py-6"
            />
          </div>
        </div>

        {/* Contact Fields */}
        <div className="mb-8 space-y-4">
          <div className="text-center text-xs font-medium text-[#8B8B8B]">
            CONTACT
          </div>

          <div>
            <div className="mb-2 text-xs font-medium text-[#2D2D2D]">
              EMAIL ADDRESS
            </div>
            <Input
              type="email"
              placeholder="kenji@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-[#E8D4C4] bg-white py-6"
            />
          </div>

          <div>
            <div className="mb-2 text-xs font-medium text-[#2D2D2D]">
              CELLPHONE
            </div>
            <div className="flex gap-2">
              <div className="flex items-center rounded-xl border border-[#E8D4C4] bg-white px-3 text-sm text-[#8B8B8B]">
                JP +81
              </div>
              <Input
                type="tel"
                placeholder="090-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 rounded-xl border-[#E8D4C4] bg-white py-6"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!firstName.trim()}
          className="w-full rounded-xl bg-[#C4775C] py-6 text-lg font-medium text-white hover:bg-[#B56A50]"
        >
          <Check className="mr-2 size-5" />
          Save & Register
        </Button>
      </div>
    </div>
  )
}
