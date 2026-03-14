"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Brain, Target, TrendingUp, Users, Lightbulb, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingScreenProps {
  onStart: () => void
}

const floatingIcons = [
  { Icon: Brain, delay: 0, x: -120, y: -80 },
  { Icon: Target, delay: 0.2, x: 140, y: -60 },
  { Icon: TrendingUp, delay: 0.4, x: -160, y: 40 },
  { Icon: Users, delay: 0.6, x: 170, y: 80 },
  { Icon: Lightbulb, delay: 0.8, x: -80, y: 120 },
  { Icon: Compass, delay: 1, x: 100, y: -120 },
]

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chart-3/10 rounded-full blur-3xl"
        />
      </div>

      {/* Floating icons around the main content */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map(({ Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ delay: 0.5 + delay, type: "spring", stiffness: 100 }}
            className="absolute top-1/2 left-1/2"
            style={{ x, y }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="p-3 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
                <Icon className="h-6 w-6 text-primary/70" />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 shadow-xl shadow-primary/10"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-12 w-12 text-primary" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-2"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            AI-Powered Career Assessment
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance"
        >
          Career{" "}
          <span className="text-primary">Guru</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-10 text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed"
        >
          Discover how well your skills, interests, and mindset match your chosen career.
          <br className="hidden md:block" />
          Take a quick interactive assessment with your AI career mentor and decide what profession you are built for.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-3"
        >
          <Button
            size="lg"
            onClick={onStart}
            className="group px-10 py-7 text-lg font-semibold rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-shadow"
          >
            Start Assessment
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <span className="text-sm text-muted-foreground">Takes only 5 minutes</span>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { icon: Target, title: "5 Career Domains", desc: "Explore diverse paths" },
            { icon: Brain, title: "Smart Analysis", desc: "AI-powered insights" },
            { icon: TrendingUp, title: "Instant Results", desc: "Get your match score" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
              className="group p-5 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all cursor-default"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full"
      />
    </div>
  )
}
