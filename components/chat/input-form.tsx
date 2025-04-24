"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"
import { useRef } from "react"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"

interface InputFormProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleMessageSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export function InputForm({ input, handleInputChange, handleMessageSubmit, isLoading }: InputFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Use the auto-resize textarea hook
  useAutoResizeTextarea(textareaRef, input, 240)

  return (
    <form onSubmit={handleMessageSubmit} className="flex w-full gap-2 max-w-3xl mx-auto">
      <div className="relative flex-1">
        <div className="glass-input-container">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Message Bennett..."
            className="min-h-[50px] max-h-[240px] resize-none glass-input pr-12 auto-resize-textarea"
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
          className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg active:shadow-sm active:translate-y-0.5 transition-all duration-150"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  )
}
