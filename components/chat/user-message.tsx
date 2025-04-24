import { Avatar } from "@/components/ui/avatar"

interface UserMessageProps {
  content: string
  isMobile: boolean
}

export function UserMessage({ content, isMobile }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className={`message-bubble user ${isMobile ? "" : "mr-10"}`}>
        <div className="text-sm">{content}</div>
      </div>
      {!isMobile && (
        <Avatar className="h-7 w-7 bg-secondary flex-shrink-0 flex items-center justify-center ml-3">
          <span className="text-xs font-medium text-secondary-foreground">You</span>
        </Avatar>
      )}
    </div>
  )
}
