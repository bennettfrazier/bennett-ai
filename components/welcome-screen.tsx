"use client"
import { useState } from "react"
import type React from "react"
import { SparkleIcon } from "./sparkle-icon"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mobile"

// Welcome message presets - short, witty questions
const welcomeMessages = [
  "Need a creative spark?",
  "Stuck on a problem?",
  "Curious about something?",
  "Want to explore ideas?",
  "Need writing help?",
  "Questions on your mind?",
  "Ready to brainstorm?",
  "Need a second opinion?",
]

interface WelcomeScreenProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export function WelcomeScreen({ input, handleInputChange, handleSubmit, isLoading }: WelcomeScreenProps) {
  // Randomly select a welcome message on initial load
  const [welcomeIndex] = useState(() => Math.floor(Math.random() * welcomeMessages.length))
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className="flex flex-col items-center justify-center h-full text-center pt-8 md:pt-12">
      <div className="max-w-xl w-full space-y-12">
        <div className="flex items-center justify-center gap-3">
          <SparkleIcon className="h-7 w-7 text-primary flex-shrink-0" />
          <h1 className={`${isMobile ? "text-2xl" : "text-3xl"} font-semibold text-foreground font-heading`}>
            {welcomeMessages[welcomeIndex]}
          </h1>
        </div>

        <div className="w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <div className="glass-input-container">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Message Bennett..."
                  className="min-h-[100px] resize-none text-base py-4 px-5 glass-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      if (input.trim()) {
                        const form = e.currentTarget.form
                        if (form) form.requestSubmit()
                      }
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                size="icon"
                className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-sm"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Ask me anything, from creative writing to in-depth research. I can help with coding, explanations,
              brainstorming, and more.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
