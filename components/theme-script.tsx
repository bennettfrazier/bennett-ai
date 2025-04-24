"use client"

import { useEffect } from "react"

export function ThemeScript() {
  useEffect(() => {
    const script = document.createElement("script")
    script.innerHTML = `
      (function() {
        try {
          const storedTheme = localStorage.getItem("theme");
          if (storedTheme) {
            document.documentElement.classList.add(storedTheme);
          } else {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            document.documentElement.classList.add(systemTheme);
            localStorage.setItem("theme", systemTheme);
          }
        } catch (e) {}
      })();
    `
    document.head.prepend(script)
  }, [])

  return null
}
