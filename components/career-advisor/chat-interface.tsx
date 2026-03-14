"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatMessage } from "./chat-message"
import { SliderQuestion, MultipleChoiceQuestion } from "./question-inputs"
import { ProgressBar } from "./progress-bar"
import { ResultsScreen } from "./results-screen"
import {
  Question,
  Message,
  UserAnswer,
  AssessmentResult,
  DomainScore,
  baselineQuestions,
  calculateDomainScores,
  shouldStopQuestioning,
  getNextQuestion,
  generateFinalResults,
} from "@/lib/career-advisor-types"

type Stage = 'questions' | 'results'

interface ChatInterfaceProps {
  onBack: () => void
}

export function ChatInterface({ onBack }: ChatInterfaceProps) {
  const [stage, setStage] = useState<Stage>('questions')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'bot',
      content: "Hi! I'm your Career Guru. I'll help you discover which career paths match your personality, skills, and interests through an intelligent assessment.",
      timestamp: new Date(),
    },
  ])
  const [answers, setAnswers] = useState<UserAnswer[]>([])
  const [askedQuestionIds, setAskedQuestionIds] = useState<Set<string>>(new Set())
  const [domainScores, setDomainScores] = useState<DomainScore[]>([])
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [initialized, setInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, stage])

  const addBotMessage = useCallback((content: string, question?: Question) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content,
          question,
          timestamp: new Date(),
        },
      ])
      setCurrentQuestion(question || null)
      setIsTyping(false)
    }, 600)
  }, [])

  const addUserMessage = (content: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        type: 'user',
        content,
        timestamp: new Date(),
      },
    ])
  }

  // Initialize with first question
  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      setTimeout(() => {
        addBotMessage(
          "Let's begin! I'll ask you some questions to understand your preferences, then narrow down the best career paths for you. Answer honestly for accurate results."
        )
        setTimeout(() => {
          const firstQuestion = baselineQuestions[0]
          if (firstQuestion) {
            setAskedQuestionIds(new Set([firstQuestion.id]))
            addBotMessage(firstQuestion.text, firstQuestion)
          }
        }, 1200)
      }, 800)
    }
  }, [initialized, addBotMessage])

  const convertToNumeric = (value: number | string, question: Question): number => {
    if (typeof value === 'number') {
      return value
    }
    // For multiple choice, map to numeric scale
    const options = question.options || []
    const index = options.indexOf(value)
    if (index === -1) return 0
    // Map 0-3 (4 options) to -10 to +10 scale
    return Math.round((index / (options.length - 1)) * 20 - 10)
  }

  const handleAnswer = (value: number | string) => {
    if (!currentQuestion) return

    const displayValue = typeof value === 'number' 
      ? (value > 0 ? `+${value}` : `${value}`)
      : value
    
    addUserMessage(displayValue)
    
    const numericValue = convertToNumeric(value, currentQuestion)
    
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      value,
      numericValue,
      parameter: currentQuestion.parameter,
    }
    
    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)
    
    // Calculate scores with all answers
    const newScores = calculateDomainScores(updatedAnswers)
    setDomainScores(newScores)
    
    // Check if we should stop or continue
    const shouldStop = shouldStopQuestioning(updatedAnswers, newScores)
    
    if (shouldStop) {
      // Generate final results
      setTimeout(() => {
        addBotMessage("Excellent! I've gathered enough information. Analyzing your responses...")
        setTimeout(() => {
          const finalResult = generateFinalResults(newScores, updatedAnswers)
          setResult(finalResult)
          setStage('results')
        }, 1500)
      }, 500)
    } else {
      // Get next question
      const updatedAskedIds = new Set(askedQuestionIds)
      updatedAskedIds.add(currentQuestion.id)
      setAskedQuestionIds(updatedAskedIds)
      
      const nextQuestion = getNextQuestion(updatedAnswers, newScores, updatedAskedIds)
      
      if (nextQuestion) {
        const transitionMessages = getTransitionMessage(updatedAnswers.length, newScores)
        
        setTimeout(() => {
          setAskedQuestionIds(prev => {
            const newSet = new Set(prev)
            newSet.add(nextQuestion.id)
            return newSet
          })
          addBotMessage(transitionMessages + nextQuestion.text, nextQuestion)
        }, 500)
      } else {
        // No more questions, finish up
        setTimeout(() => {
          addBotMessage("I've completed the assessment. Let me analyze your profile...")
          setTimeout(() => {
            const finalResult = generateFinalResults(newScores, updatedAnswers)
            setResult(finalResult)
            setStage('results')
          }, 1500)
        }, 500)
      }
    }
  }

  const getTransitionMessage = (questionCount: number, scores: DomainScore[]): string => {
    const activeDomains = scores.filter(d => !d.eliminated).length
    
    if (questionCount === baselineQuestions.length) {
      const topDomains = scores
        .filter(d => !d.eliminated)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map(d => d.domain.replace('-', ' '))
      return `Interesting! Based on your responses, I see potential in ${topDomains.join(' and ')}. Let me ask some more specific questions. `
    }
    
    if (activeDomains <= 2 && questionCount > 15) {
      return "We're narrowing it down! "
    }
    
    const transitions = [
      "Got it! ",
      "Thanks for that. ",
      "Interesting! ",
      "I see. ",
      "Noted! ",
      "Good to know. ",
    ]
    return transitions[Math.floor(Math.random() * transitions.length)]
  }

  const handleRestart = () => {
    setStage('questions')
    setAnswers([])
    setAskedQuestionIds(new Set())
    setDomainScores([])
    setResult(null)
    setCurrentQuestion(null)
    setInitialized(false)
    setMessages([
      {
        id: 'welcome-restart',
        type: 'bot',
        content: "Welcome back! Let's start a fresh assessment to discover your ideal career path.",
        timestamp: new Date(),
      },
    ])
    setTimeout(() => {
      setInitialized(true)
      const firstQuestion = baselineQuestions[0]
      if (firstQuestion) {
        setAskedQuestionIds(new Set([firstQuestion.id]))
        addBotMessage(firstQuestion.text, firstQuestion)
      }
    }, 1000)
  }

  const totalQuestions = 20 // Approximate average
  const progress = Math.min(answers.length, totalQuestions)

  return (
    <div className="flex flex-col h-full">
      {stage === 'questions' && (
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border p-4">
          <ProgressBar 
            current={progress} 
            total={totalQuestions}
            label="Career Discovery Progress"
          />
          {domainScores.length > 0 && answers.length >= 6 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {domainScores
                .filter(d => !d.eliminated)
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map(d => (
                  <span 
                    key={d.domain}
                    className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    {d.domain.replace('-', ' ')} ({Math.round(d.score)}%)
                  </span>
                ))
              }
            </div>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              content={message.content}
            >
              {message.type === 'bot' && 
               message.question && 
               index === messages.length - 1 && 
               stage === 'questions' && 
               !isTyping && (
                <>
                  {message.question.type === 'slider' && (
                    <SliderQuestion 
                      question={message.question} 
                      onAnswer={handleAnswer} 
                    />
                  )}
                  {message.question.type === 'multiple-choice' && (
                    <MultipleChoiceQuestion 
                      question={message.question} 
                      onAnswer={handleAnswer} 
                    />
                  )}
                </>
              )}
            </ChatMessage>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-primary-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-primary-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-primary-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'results' && result && (
          <ResultsScreen
            result={result}
            onRestart={handleRestart}
          />
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
