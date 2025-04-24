"use client"
import { useChat } from "ai/react"
import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useRef, useEffect } from "react"
import { WelcomeScreen } from "@/components/welcome-screen"
import { useMediaQuery } from "@/hooks/use-mobile"
import { Header } from "@/components/chat/header"
import { MessageList } from "@/components/chat/message-list"
import { InputForm } from "@/components/chat/input-form"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat()
  const [completedMessages, setCompletedMessages] = useState<string[]>([])
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({})
  const [userScrolledReasoning, setUserScrolledReasoning] = useState<Record<string, boolean>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const reasoningRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [userHasScrolled, setUserHasScrolled] = useState(false)
  const prevLoadingRef = useRef(isLoading)
  const prevMessagesLengthRef = useRef(messages.length)
  const lastMessageRef = useRef<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Initialize reasoning as expanded for streaming messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "assistant" && isLoading && !completedMessages.includes(lastMessage.id)) {
        setExpandedReasoning((prev) => ({
          ...prev,
          [lastMessage.id]: true,
        }))
      }
    }
  }, [messages, isLoading, completedMessages])

  // Collapse reasoning when streaming completes
  useEffect(() => {
    if (prevLoadingRef.current && !isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "assistant") {
        // Mark message as completed
        if (!completedMessages.includes(lastMessage.id)) {
          setCompletedMessages((prev) => [...prev, lastMessage.id])
        }

        // Collapse reasoning after a short delay
        setTimeout(() => {
          setExpandedReasoning((prev) => ({
            ...prev,
            [lastMessage.id]: false,
          }))

          // Scroll to the latest message
          setTimeout(() => {
            scrollToLatestMessage()
          }, 300) // Small delay to allow for the collapse animation
        }, 1000) // 1 second delay before collapsing
      }
    }

    prevLoadingRef.current = isLoading
  }, [isLoading, messages, completedMessages])

  // Function to scroll to the latest message
  const scrollToLatestMessage = () => {
    if (messagesEndRef.current && contentRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // Only auto-scroll if:
    // 1. User hasn't manually scrolled up
    // 2. A new message was added (not just updated)
    // 3. The last message is from the user or we're loading a response
    const shouldAutoScroll =
      !userHasScrolled ||
      messages.length > prevMessagesLengthRef.current ||
      (messages.length > 0 && messages[messages.length - 1].role === "user") ||
      isLoading

    if (shouldAutoScroll && messagesEndRef.current) {
      scrollToLatestMessage()
    }

    // Track the last message ID to detect new messages
    if (messages.length > 0) {
      lastMessageRef.current = messages[messages.length - 1].id
    }

    prevMessagesLengthRef.current = messages.length
  }, [messages, isLoading, userHasScrolled])

  // Reset userHasScrolled when a new message is added
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      setUserHasScrolled(false)
    }
  }, [messages.length])

  // Handle scroll events for main content
  useEffect(() => {
    const contentElement = contentRef.current
    if (!contentElement) return

    const handleScroll = () => {
      if (!contentElement) return

      const isScrolledToBottom =
        contentElement.scrollHeight - contentElement.scrollTop <= contentElement.clientHeight + 100

      if (!isScrolledToBottom) {
        setUserHasScrolled(true)
      } else {
        setUserHasScrolled(false)
      }
    }

    contentElement.addEventListener("scroll", handleScroll)
    return () => contentElement.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-scroll reasoning containers when streaming
  useEffect(() => {
    if (isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (
        lastMessage.role === "assistant" &&
        expandedReasoning[lastMessage.id] &&
        !userScrolledReasoning[lastMessage.id] &&
        reasoningRefs.current[lastMessage.id]
      ) {
        const reasoningElement = reasoningRefs.current[lastMessage.id]
        if (reasoningElement) {
          reasoningElement.scrollTop = reasoningElement.scrollHeight
        }
      }
    }
  }, [messages, isLoading, expandedReasoning, userScrolledReasoning])

  // Custom submit handler to ensure scroll to bottom
  const handleMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    // Reset scroll state when submitting a new message
    setUserHasScrolled(false)

    // Call the original submit handler
    handleSubmit(e)

    // Scroll to bottom after a short delay to ensure the UI has updated
    setTimeout(() => {
      scrollToLatestMessage()
    }, 100)
  }

  // Extract reasoning from message parts
  const getReasoningFromMessage = (message: any) => {
    if (!message.parts) return null

    const reasoningPart = message.parts.find((part: any) => part.type === "reasoning")
    if (!reasoningPart) return null

    return reasoningPart.details
      ?.filter((detail: any) => detail.type === "text")
      .map((detail: any) => detail.text)
      .join("\n")
  }

  // Check if a message is still streaming
  const isMessageStreaming = (messageId: string) => {
    return (
      isLoading &&
      !completedMessages.includes(messageId) &&
      messages.length > 0 &&
      messages[messages.length - 1].id === messageId
    )
  }

  // Toggle reasoning expansion for a specific message
  const toggleReasoning = (messageId: string) => {
    setExpandedReasoning((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }))
  }

  // Handle reasoning scroll
  const handleReasoningScroll = (messageId: string) => {
    if (!reasoningRefs.current[messageId]) return

    const reasoningElement = reasoningRefs.current[messageId]
    if (!reasoningElement) return

    const isScrolledToBottom =
      reasoningElement.scrollHeight - reasoningElement.scrollTop <= reasoningElement.clientHeight + 20

    if (!isScrolledToBottom) {
      setUserScrolledReasoning((prev) => ({
        ...prev,
        [messageId]: true,
      }))
    }
  }

  // Set message reference with proper timing
  const setMessageRef = (el: HTMLDivElement | null, messageId: string) => {
    if (el) {
      messageRefs.current[messageId] = el
    }
  }

  // Check if we should show the welcome screen
  const showWelcomeScreen = messages.length === 0

  return (
    <div className="mobile-layout">
      {/* Fixed Header */}
      <Header />

      {/* Scrollable Content */}
      <div className="mobile-content" ref={contentRef}>
        <CardContent className="p-4 pt-6 md:p-6 md:pt-8 pb-20 bg-background h-full">
          {error && (
            <div className="p-3 mb-4 bg-destructive/10 text-destructive rounded-md text-sm">
              Error: {error.message || "Something went wrong"}
            </div>
          )}

          {showWelcomeScreen ? (
            <WelcomeScreen
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleMessageSubmit}
              isLoading={isLoading}
            />
          ) : (
            <MessageList
              messages={messages}
              isLoading={isLoading}
              completedMessages={completedMessages}
              expandedReasoning={expandedReasoning}
              toggleReasoning={toggleReasoning}
              handleReasoningScroll={handleReasoningScroll}
              messageRefs={messageRefs}
              reasoningRefs={reasoningRefs}
              messagesEndRef={messagesEndRef}
              isMobile={isMobile}
              getReasoningFromMessage={getReasoningFromMessage}
              isMessageStreaming={isMessageStreaming}
              setMessageRef={setMessageRef}
            />
          )}
        </CardContent>
      </div>

      {/* Footer */}
      {!showWelcomeScreen && (
        <div className="mobile-footer">
          <Card className="border-none rounded-none shadow-none">
            <CardContent className="border-t bg-card p-4">
              <InputForm
                input={input}
                handleInputChange={handleInputChange}
                handleMessageSubmit={handleMessageSubmit}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
