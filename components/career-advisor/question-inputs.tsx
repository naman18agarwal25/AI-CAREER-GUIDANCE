"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Question } from "@/lib/career-advisor-types"
import { cn } from "@/lib/utils"

interface SliderQuestionProps {
  question: Question
  onAnswer: (value: number) => void
}

export function SliderQuestion({ question, onAnswer }: SliderQuestionProps) {
  const [value, setValue] = useState(0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4 p-4 rounded-xl bg-card border border-border"
    >
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{question.minLabel || 'Min'}</span>
        <span className="font-medium text-foreground">{value > 0 ? `+${value}` : value}</span>
        <span>{question.maxLabel || 'Max'}</span>
      </div>
      <Slider
        min={question.min ?? -10}
        max={question.max ?? 10}
        step={1}
        value={[value]}
        onValueChange={([v]) => setValue(v)}
        className="w-full"
      />
      <Button 
        onClick={() => onAnswer(value)} 
        className="w-full rounded-lg"
        size="sm"
      >
        Submit Answer
      </Button>
    </motion.div>
  )
}

interface MultipleChoiceQuestionProps {
  question: Question
  onAnswer: (value: string) => void
}

export function MultipleChoiceQuestion({ question, onAnswer }: MultipleChoiceQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null)

  if (!question.options) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-2"
    >
      {question.options.map((option, index) => (
        <button
          key={option}
          onClick={() => setSelected(option)}
          className={cn(
            "w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm",
            selected === option
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border bg-card text-card-foreground hover:border-primary/50"
          )}
        >
          <span className="font-medium text-muted-foreground mr-2">{String.fromCharCode(65 + index)}.</span>
          {option}
        </button>
      ))}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button 
            onClick={() => onAnswer(selected)} 
            className="w-full mt-2 rounded-lg"
            size="sm"
          >
            Confirm Selection
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

interface QuickReplyQuestionProps {
  options: string[]
  onAnswer: (value: string) => void
}

export function QuickReplyQuestion({ options, onAnswer }: QuickReplyQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2"
    >
      {options.map((option) => (
        <Button
          key={option}
          variant="outline"
          size="sm"
          onClick={() => onAnswer(option)}
          className="rounded-full"
        >
          {option}
        </Button>
      ))}
    </motion.div>
  )
}
