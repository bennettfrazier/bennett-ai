"use client"
import { UserMessage } from "./user-message"
import type React from "react"

import { AssistantMessage } from "./assistant-message"
import { ThinkingIndicator } from "./thinking-indicator"
import { Avatar } from "@/components/ui/avatar"
import { SparkleIcon } from "@/components/sparkle-icon"

interface MessageListProps {
  messages: any[]
  isLoading: boolean
  completedMessages: string[]
  expandedReasoning: Record<string, boolean>
  toggleReasoning: (messageId: string) => void
  handleReasoningScroll: (messageId: string) => void
  messageRefs: Record<string, HTMLDivElement | null>
  reasoningRefs: Record<string, HTMLDivElement | null>
  messagesEndRef: React.RefObject<HTMLDivElement>
  isMobile: boolean
  getReasoningFromMessage: (message: any) => string | null
  isMessageStreaming: (messageId: string) => boolean
  setMessageRef: (el: HTMLDivElement | null, messageId: string) => void
}

export function MessageList({
  messages,
  isLoading,
  completedMessages,
  expandedReasoning,
  toggleReasoning,
  handleReasoningScroll,
  messageRefs,
  reasoningRefs,
  messagesEndRef,
  isMobile,
  getReasoningFromMessage,
  isMessageStreaming,
  setMessageRef,
}: MessageListProps) {
  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      {messages.map((message) => {
        const reasoning = getReasoningFromMessage(message)
        const isStreaming = message.role === "assistant" && isMessageStreaming(message.id)
        const isReasoningExpanded = expandedReasoning[message.id] || false

        return (
          <div key={message.id} className="space-y-2">
            {message.role === "user" ? (
              <UserMessage content={message.content} isMobile={isMobile} />
            ) : (
              <AssistantMessage
                message={message}
                reasoning={reasoning}
                isStreaming={isStreaming}
                isReasoningExpanded={isReasoningExpanded}
                toggleReasoning={toggleReasoning}
                handleReasoningScroll={handleReasoningScroll}
                setMessageRef={setMessageRef}
                reasoningRefs={reasoningRefs}
                isMobile={isMobile}
              />
            )}
          </div>
        )
      })}

      {/* Show a new message bubble with animation when loading and no assistant message is present */}
      {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
        <div className="flex justify-start">
          <div className="flex items-start gap-3 w-full">
            {!isMobile && (
              <Avatar className="h-7 w-7 flex-shrink-0 flex items-center justify-center">
                <SparkleIcon className="h-4 w-4 text-primary" />
              </Avatar>
            )}
            <div className="message-bubble assistant">
              <ThinkingIndicator />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
