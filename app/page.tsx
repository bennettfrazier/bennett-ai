"use client"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, Moon, Sun, Send, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useTheme } from "@/components/theme-provider"
import { SparkleIcon } from "@/components/sparkle-icon"
import { WelcomeScreen } from "@/components/welcome-screen"
import { useMediaQuery } from "@/hooks/use-mobile"

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
  const { theme, setTheme, resolvedTheme } = useTheme()
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

          // Scroll to the top of the response if user hasn't scrolled
          if (!userHasScrolled && messageRefs.current[lastMessage.id]) {
            setTimeout(() => {
              const headerHeight = 56 // Height of the fixed header
              const messageEl = messageRefs.current[lastMessage.id]
              if (messageEl) {
                const messagePosition = messageEl.getBoundingClientRect().top
                const scrollPosition = messagePosition + window.scrollY - headerHeight - 16 // 16px extra padding

                contentRef.current?.scrollTo({
                  top: scrollPosition,
                  behavior: "smooth",
                })
              }
            }, 300) // Small delay to allow for the collapse animation
          }
        }, 1000) // 1 second delay before collapsing
      }
    }

    prevLoadingRef.current = isLoading
  }, [isLoading, messages, completedMessages, userHasScrolled])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!userHasScrolled && messagesEndRef.current && contentRef.current) {
      // Use scrollTo instead of scrollIntoView for more control
      const scrollHeight = contentRef.current.scrollHeight
      contentRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages, isLoading, userHasScrolled])

  // Reset userHasScrolled when a new message is added
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      setUserHasScrolled(false)
    }
    prevMessagesLengthRef.current = messages.length
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

  // Toggle theme
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
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
      <div className="mobile-header">
        <Card className="border-none rounded-none shadow-none">
          <CardHeader className="border-b bg-card py-3">
            <CardTitle className="flex justify-between items-center text-base font-medium">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7 flex items-center justify-center">
                  <SparkleIcon className="h-5 w-5 text-primary" />
                </Avatar>
                <span className="text-foreground">Bennett AI</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full h-8 w-8 theme-toggle"
                aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

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
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto pb-10">
              {messages.map((message) => {
                const reasoning = getReasoningFromMessage(message)
                const isStreaming = message.role === "assistant" && isMessageStreaming(message.id)
                const isReasoningExpanded = expandedReasoning[message.id] || false

                return (
                  <div key={message.id} className="space-y-2">
                    {message.role === "user" ? (
                      // User message - right aligned, no avatar on mobile
                      <div className="flex justify-end">
                        <div className={`message-bubble user ${isMobile ? "" : "mr-10"}`}>
                          <div className="text-sm">{message.content}</div>
                        </div>
                        {!isMobile && (
                          <Avatar className="h-7 w-7 bg-secondary flex-shrink-0 flex items-center justify-center ml-3">
                            <span className="text-xs font-medium text-secondary-foreground">You</span>
                          </Avatar>
                        )}
                      </div>
                    ) : (
                      // Assistant message - full width on mobile, no avatar
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
                              <div className="mb-2">
                                <div
                                  className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground mb-1"
                                  onClick={() => toggleReasoning(message.id)}
                                >
                                  {isReasoningExpanded ? (
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
                                    isReasoningExpanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                                  }`}
                                >
                                  <div
                                    ref={(el) => (reasoningRefs.current[message.id] = el)}
                                    onScroll={() => handleReasoningScroll(message.id)}
                                    className="pl-5 p-2 bg-muted border border-border rounded-lg text-xs text-muted-foreground overflow-auto max-h-64 reasoning-content"
                                  >
                                    <div className="markdown-content text-xs">
                                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{reasoning}</ReactMarkdown>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Show thinking animation while streaming */}
                            {isStreaming ? (
                              <div className="flex items-center gap-3 py-2">
                                <div className="typing-indicator">
                                  <span></span>
                                  <span></span>
                                  <span></span>
                                </div>
                                <span className="text-xs text-muted-foreground">Thinking...</span>
                              </div>
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
                                    ?.filter((part) => part.type === "text")
                                    .map((part, index) => (
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
                      <div className="flex items-center gap-3">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span className="text-xs text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>
      </div>

      {/* Footer */}
      {!showWelcomeScreen && (
        <div className="mobile-footer">
          <Card className="border-none rounded-none shadow-none">
            <CardContent className="border-t bg-card p-4">
              <form onSubmit={handleSubmit} className="flex w-full gap-2 max-w-3xl mx-auto">
                <div className="relative flex-1">
                  <div className="glass-input-container">
                    <Textarea
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Message Claude..."
                      className="min-h-[50px] resize-none glass-input"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          if (input.trim()) {
                            handleSubmit(e as any)
                          }
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
