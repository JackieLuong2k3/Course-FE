"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm">
        <span className="hidden sm:inline-block">Theme</span>
        <span className="sm:hidden">🌗</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <span className="hidden sm:inline-block">
        {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
      </span>
      <span className="sm:hidden">
        {resolvedTheme === "light" ? "🌙" : "☀️"}
      </span>
    </Button>
  )
}
