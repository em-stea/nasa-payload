'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '../button/button'

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="flex flex-col gap-2 size-30">
      <Button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        variant="ghost"
        size="intrinsic"
        className="p-4"
      >
        <Sun className="size-5 text-primary-foreground dark:hidden" />
        <Moon className="hidden size-5 text-primary-foreground dark:block" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
