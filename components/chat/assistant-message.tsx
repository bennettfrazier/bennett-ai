"use client"
import { Avatar } from "@/components/ui/avatar"
import { SparkleIcon } from "@/components/sparkle-icon"
import { ThinkingIndicator } from "./thinking-indicator"
import { ReasoningSection } from "./reasoning-section"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface AssistantMessageProps {
  message: any
  reasoning: string | null
  isStreaming: boolean
  isReasoningExpanded: boolean
  toggleReasoning: (messageId: string) => void
  handleReasoningScroll: (messageId: string) => void
  setMessageRef: (el: HTMLDivElement | null, messageId: string) => void
  reasoningRefs: Record<string, HTMLDivElement | null>
  isMobile: boolean
}

export function AssistantMessage({
  message,
  reasoning,
  isStreaming,
  isReasoningExpanded,
  toggleReasoning,
  handleReasoningScroll,
  setMessageRef,
  reasoningRefs,
  isMobile,
}: AssistantMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3 w-full">
        {!isMobile && (
          <Avatar className="h-7 w-7 flex-shrink-0 flex items-center justify-center">
            <SparkleIcon className="h-4 w-4 text-primary" />
          </Avatar>
        )}

        <div className="message-bubble assistant">
          {/* Show reasoning toggle if reasoning exists */}
          {reasoning && (
            <ReasoningSection
              messageId={message.id}
              reasoning={reasoning}
              isExpanded={isReasoningExpanded}
              toggleReasoning={toggleReasoning}
              onReasoningScroll={handleReasoningScroll}
              reasoningRef={(el) => (reasoningRefs[message.id] = el)}
            />
          )}

          {/* Show thinking animation while streaming */}
          {isStreaming ? (
            <ThinkingIndicator />
          ) : (
            /* Show content when not streaming */
            <div className="mt-3" ref={(el) => setMessageRef(el, message.id)}>
              {/* Only render content once - prioritize message.content if it exists */}
              {message.content ? (
                <div className="markdown-content text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                </div>
              ) : (
                /* If no direct content, look for text parts */
                message.parts
                  ?.filter((part: any) => part.type === "text")
                  .map((part: any, index: number) => (
                    <div key={index} className="markdown-content text-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.text}</ReactMarkdown>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
