"use client"

import { useEffect, useState } from "react"
import { MessageSquare, X } from "lucide-react"

interface NotificationToastProps {
  kidName: string
  onClose: () => void
}

export function NotificationToast({ kidName, onClose }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100)

    // Auto close after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg border border-[#E8D4C4]">
        <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
          <MessageSquare className="size-5 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#2D2D2D]">
            {kidName}に通知しました
          </p>
          <p className="text-xs text-[#8B8B8B]">
            {kidName} was notified via SMS
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-2 rounded-full p-1 hover:bg-[#F5EDE8]"
        >
          <X className="size-4 text-[#8B8B8B]" />
        </button>
      </div>
    </div>
  )
}
