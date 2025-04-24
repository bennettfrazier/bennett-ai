"use client"
import { ChevronDown, ChevronUp } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ReasoningSectionProps {
  messageId: string
  reasoning: string
  isExpanded: boolean
  toggleReasoning: (messageId: string) => void
  onReasoningScroll: (messageId: string) => void
  reasoningRef: (el: HTMLDivElement | null) => void
}

export function ReasoningSection({
  messageId,
  reasoning,
  isExpanded,
  toggleReasoning,
  onReasoningScroll,
  reasoningRef,
}: ReasoningSectionProps) {
  return (
    <div className="mb-2">
      <div
        className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground mb-1"
        onClick={() => toggleReasoning(messageId)}
      >
        {isExpanded ? (
          <>
            <ChevronUp className="h-3 w-3" />
            <span>Hide reasoning</span>
          </>
        ) : (
          <>
            <ChevronDown className="h-3 w-3" />
            <span>Show reasoning</span>
          </>
        )}
      </div>

      <div
        className={`reasoning-container overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          ref={reasoningRef}
          onScroll={() => onReasoningScroll(messageId)}
          className="pl-5 p-2 bg-muted border border-border rounded-lg text-xs text-muted-foreground overflow-auto max-h-64 reasoning-content scrollable"
        >
          <div className="markdown-content text-xs">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{reasoning}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
