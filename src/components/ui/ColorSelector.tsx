"use client"
import { cn } from "@/lib/utils"
import { BaseProps } from "../type"
import { CheckIcon } from "lucide-react"

export const COLOR_VARS = [
  '--color-primary', '--color-info', '--color-success',
  '--color-error', '--color-warning', '--color-accent',
  '--color-neutral', '--color-secondary'
]

interface IProps extends BaseProps {
  colors?: string[], defaultValue?: string, onChange?: (color: string) => void
}
const ColorSelector = (props: IProps) => {
  const { name = 'color', colors = COLOR_VARS, className } = props

  const blockClasses = "w-8 h-8 rounded-2xl border border-2 cursor-pointer transition-all " +
    "text-transparent flex items-center justify-center"
  const hoverClasses = " hover:bg-gray-300 duration-100 cursor-pointer "
  const checkClasses = `peer-checked:shadow peer-checked:border-base-content peer-checked:text-primary-content`
  const checkboxClasses = blockClasses + hoverClasses + checkClasses
  return (
    <div className={cn('flex flex-row flex-wrap gap-1 text-primary-content', className)}>
      {colors.map(color => {
        const isVar = color.startsWith('--')
        const backgroundColor = isVar ? `var(${color})` : color

        return (
          <label key={color}>
            <input
              className="sr-only peer"
              name={name}
              type="radio"
              value={color}
              defaultChecked={props.defaultValue === color}
              onChange={() => props.onChange?.(color)}
            />
            <div className={checkboxClasses} style={{ backgroundColor }}><CheckIcon size={18} /></div>
          </label>
        )
      })}
    </div>
  )
}

export default ColorSelector