"use client"

import { useAppContext } from "@/context"
import { cn } from "@/lib/utils"
import { MoonIcon, SunIcon } from "lucide-react"
import { BaseProps } from "../type"

const ThemeSwitcher = ({ className }: BaseProps) => {
  const { theme, setTheme } = useAppContext()
  return (
    <button
      className={cn("btn btn-ghost", className)}
      onClickCapture={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }}
    >
      <label className="swap swap-rotate pointer-events-none">
        <input
          type="checkbox"
          className="absolute left-0 theme-controller"
          onChange={() => false}
          checked={theme === 'light'}
        />
        <SunIcon className="swap-on" fill="yellow" size={20} />
        <MoonIcon className="swap-off" color="yellow" size={20} />
      </label>
    </button>
  )
}

export default ThemeSwitcher