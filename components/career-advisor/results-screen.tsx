"use client"

import { motion } from "framer-motion"
import { 
  CheckCircle2, 
  AlertCircle, 
  Target, 
  TrendingUp,
  RotateCcw,
  Trophy,
  Medal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AssessmentResult, domainInfo } from "@/lib/career-advisor-types"
import { cn } from "@/lib/utils"

interface ResultsScreenProps {
  result: AssessmentResult
  onRestart: () => void
}

export function ResultsScreen({ result, onRestart }: ResultsScreenProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-chart-4"
    if (score >= 50) return "text-primary"
    return "text-chart-5"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent Match"
    if (score >= 70) return "Strong Match"
    if (score >= 55) return "Good Potential"
    if (score >= 40) return "Developing Match"
    return "Consider Alternatives"
  }

  const topDomainInfo = domainInfo[result.topDomain]

  return (
    <div className="space-y-6 pb-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-bold text-foreground">
          Your Career Match Results
        </h2>
        <p className="text-muted-foreground">
          Based on your responses, here are your top career matches
        </p>
        
        {/* Top Match Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-primary/10 border border-primary/20"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-primary">Best Match</span>
          </div>
          
          <div className="text-3xl font-bold text-foreground mb-2">
            {topDomainInfo.name}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {topDomainInfo.description}
          </p>
          
          <div className="relative mx-auto w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-secondary"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                className={getScoreColor(result.suitabilityScore)}
                initial={{ strokeDasharray: "0 352" }}
                animate={{ strokeDasharray: `${(result.suitabilityScore / 100) * 352} 352` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={cn("text-3xl font-bold", getScoreColor(result.suitabilityScore))}
              >
                {result.suitabilityScore}%
              </motion.span>
              <span className="text-xs text-muted-foreground">Match</span>
            </div>
          </div>
          
          <p className={cn("text-lg font-semibold mt-4", getScoreColor(result.suitabilityScore))}>
            {getScoreLabel(result.suitabilityScore)}
          </p>
        </motion.div>
      </motion.div>

      {/* Other Career Matches */}
      {result.rankedDomains.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Medal className="h-5 w-5 text-muted-foreground" />
            Other Potential Matches
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.rankedDomains.slice(1, 5).map((ranked, index) => (
              <motion.div
                key={ranked.domain}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{domainInfo[ranked.domain].icon}</span>
                  <div>
                    <div className="font-medium text-foreground">
                      {domainInfo[ranked.domain].name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {ranked.confidence}% confidence
                    </div>
                  </div>
                </div>
                <div className={cn("text-xl font-bold", getScoreColor(ranked.score))}>
                  {ranked.score}%
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-5 w-5 text-chart-4" />
                Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.strengths.map((strength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-chart-4 shrink-0" />
                  {strength}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="h-5 w-5 text-chart-5" />
                Areas for Growth
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.weaknesses.map((weakness, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-chart-5 shrink-0" />
                  {weakness}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-primary" />
                Recommended Specializations
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {result.recommendedSpecializations.map((spec, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {spec}
                </motion.span>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-accent" />
                Skills to Develop
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {result.skillsToImprove.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  {skill}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="flex justify-center pt-4"
      >
        <Button
          onClick={onRestart}
          className="rounded-xl px-8"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Take Assessment Again
        </Button>
      </motion.div>
    </div>
  )
}
