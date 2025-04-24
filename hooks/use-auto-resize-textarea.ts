"use client"

import { useEffect, type RefObject } from "react"

export function useAutoResizeTextarea(textareaRef: RefObject<HTMLTextAreaElement>, value: string, maxHeight = 240) {
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto"

    // Calculate the new height (capped at maxHeight)
    const newHeight = Math.min(textarea.scrollHeight, maxHeight)

    // Set the new height
    textarea.style.height = `${newHeight}px`

    // Add or remove the scrollable class based on content height
    if (textarea.scrollHeight > maxHeight) {
      textarea.classList.add("scrollable")
    } else {
      textarea.classList.remove("scrollable")
    }
  }, [textareaRef, value, maxHeight])
}
