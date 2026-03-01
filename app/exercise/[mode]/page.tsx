"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Check, X, RotateCcw, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EXERCISES, MODE_INFO, type ExerciseMode, type Exercise } from "@/lib/exercises"
import { cn } from "@/lib/utils"

export default function ExercisePage() {
  const params = useParams()
  const router = useRouter()
  const mode = params.mode as ExerciseMode

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const exercises = EXERCISES[mode] || []
  const modeInfo = MODE_INFO[mode]
  const currentExercise = exercises[currentIndex]

  useEffect(() => {
    if (!modeInfo) {
      router.push("/")
    }
  }, [modeInfo, router])

  if (!modeInfo || !currentExercise) {
    return null
  }

  const handleAnswer = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)

    if (index === currentExercise.correctIndex) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setCompleted(false)
  }

  const [lastKidId, setLastKidId] = useState<string | null>(null)

  useEffect(() => {
    const kids = getKids()
    if (kids.length > 0) {
      setLastKidId(kids[0].id)
    }
  }, [])

  if (completed) {
    const percentage = Math.round((score / exercises.length) * 100)
    return (
      <div className="flex min-h-screen flex-col bg-[#FDF8F4]">
        <div className="flex items-center px-6 py-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white shadow-sm"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="size-5" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-yellow-100">
            <Trophy className="size-12 text-yellow-500" />
          </div>

          <h1 className="mb-2 text-2xl font-bold text-[#2D2D2D]">
            お疲れ様でした！
          </h1>
          <p className="mb-1 text-[#8B8B8B]">Great work!</p>

          <div className="my-6 text-center">
            <div className="text-5xl font-bold" style={{ color: modeInfo.color }}>
              {score}/{exercises.length}
            </div>
            <p className="mt-2 text-[#8B8B8B]">{percentage}% correct</p>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-[280px]">
            {lastKidId && (
              <Button
                onClick={() => router.push(`/talk/${lastKidId}?score=${score}&mode=${mode}`)}
                className="rounded-xl bg-[#C4775C] py-7 text-lg hover:bg-[#B56A50]"
              >
                <div className="flex items-center gap-2">
                  <span>💬</span>
                  <span>報告する (Tell your kid!)</span>
                </div>
              </Button>
            )}
            <div className="flex gap-2">
              <Button
                onClick={handleRestart}
                variant="outline"
                className="flex-1 rounded-xl py-5"
              >
                <RotateCcw className="mr-2 size-4" />
                もう一度
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="secondary"
                className="flex-1 rounded-xl py-5"
              >
                ホームへ
              </Button>
            </div>
          </div>
        </div>
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
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1 text-sm text-white"
          style={{ backgroundColor: modeInfo.color }}
        >
          <span>{modeInfo.icon}</span>
          <span>{modeInfo.label}</span>
        </div>
        <div className="text-sm text-[#8B8B8B]">
          {currentIndex + 1}/{exercises.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-6 h-2 overflow-hidden rounded-full bg-[#E8D4C4]">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${((currentIndex + (showResult ? 1 : 0)) / exercises.length) * 100}%`,
            backgroundColor: modeInfo.color,
          }}
        />
      </div>

      {/* Question */}
      <div className="flex flex-1 flex-col px-6 py-8">
        <Card className="mb-6 border-0 bg-white p-6 shadow-lg">
          <p className="mb-2 text-lg font-medium text-[#2D2D2D]">
            {currentExercise.questionJa}
          </p>
          <p className="text-sm text-[#8B8B8B]">{currentExercise.question}</p>
        </Card>

        {/* Options */}
        <div className="space-y-3">
          {currentExercise.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === currentExercise.correctIndex
            const showCorrect = showResult && isCorrect
            const showWrong = showResult && isSelected && !isCorrect

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border-2 bg-white p-4 text-left transition-all",
                  !showResult && "hover:border-[#C4775C] hover:bg-[#FDF8F4]",
                  showCorrect && "border-green-500 bg-green-50",
                  showWrong && "border-red-500 bg-red-50",
                  !showResult && isSelected && "border-[#C4775C]",
                  !showResult && !isSelected && "border-[#E8D4C4]"
                )}
              >
                <span className={cn(
                  "font-medium",
                  showCorrect && "text-green-700",
                  showWrong && "text-red-700"
                )}>
                  {option}
                </span>
                {showCorrect && <Check className="size-5 text-green-500" />}
                {showWrong && <X className="size-5 text-red-500" />}
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <Card className="mt-6 border-0 bg-[#F5EDE8] p-4">
            <p className="mb-1 text-sm font-medium text-[#2D2D2D]">
              {currentExercise.explanationJa}
            </p>
            <p className="text-xs text-[#8B8B8B]">{currentExercise.explanation}</p>
          </Card>
        )}

        {/* Next button */}
        {showResult && (
          <Button
            onClick={handleNext}
            className="mt-6 w-full rounded-xl bg-[#C4775C] py-6 text-lg hover:bg-[#B56A50]"
          >
            {currentIndex < exercises.length - 1 ? "次へ →" : "結果を見る"}
          </Button>
        )}
      </div>
    </div>
  )
}
