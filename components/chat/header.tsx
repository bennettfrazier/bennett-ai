"use client"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { SparkleIcon } from "@/components/sparkle-icon"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
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
  )
}
