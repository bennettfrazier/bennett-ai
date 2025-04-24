"use client"
import { useState, useRef } from "react"
import type React from "react"
import { SparkleIcon } from "./sparkle-icon"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mobile"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Use the auto-resize textarea hook
  useAutoResizeTextarea(textareaRef, input, 240)

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="max-w-xl w-full space-y-6 md:space-y-8">
        <div className={`flex ${isMobile ? "flex-col" : "flex-row"} items-center justify-center gap-3`}>
          <SparkleIcon className={`h-7 w-7 text-primary flex-shrink-0 ${isMobile ? "mb-2" : ""}`} />
          <h1 className={`${isMobile ? "text-xl" : "text-3xl"} font-semibold text-foreground font-heading`}>
            {welcomeMessages[welcomeIndex]}
          </h1>
        </div>

        <div className="w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <div className="glass-input-container">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Message Bennett..."
                  className="min-h-[100px] max-h-[240px] resize-none text-base py-4 px-5 pr-16 glass-input auto-resize-textarea"
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
                className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg active:shadow-sm active:translate-y-0.5 transition-all duration-150"
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
