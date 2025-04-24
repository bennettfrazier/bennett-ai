export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="text-xs text-muted-foreground">Thinking...</span>
    </div>
  )
}
