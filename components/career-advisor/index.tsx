"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LandingScreen } from "./landing-screen"
import { ChatInterface } from "./chat-interface"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sparkles } from "lucide-react"

export function CareerAdvisor() {
  const [started, setStarted] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Career Guru</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto max-w-3xl">
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <LandingScreen onStart={() => setStarted(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-[calc(100vh-3.5rem)]"
            >
              <ChatInterface onBack={() => setStarted(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
