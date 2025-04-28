"use client"

import { cn } from "@/lib/utils"
import { ReactNode, useEffect, useState } from "react"
import { BaseProps } from "../type"

interface ISelectProps extends BaseProps {
  name: string,
  multiple?: boolean,
  defaultValue: string | string[],
  options?: { label?: ReactNode, value: string }[],
  optionClassName?: string
  checkedClassName?: string
  onChange?: (value: string | string[]) => void
}

const Select = (props: ISelectProps) => {
  const {
    name, multiple, options = [], defaultValue, className, optionClassName, checkedClassName = 'bg-primary text-white'
  } = props

  const [value, setValue] = useState(defaultValue)

  const blockClasses = "flex items-center justify-center cursor-pointer transition-all bg-transparent"
  const hoverClasses = " hover:opacity-80 duration-200 cursor-pointer"
  const checkboxClasses = blockClasses + hoverClasses

  useEffect(() => {
    if (props.onChange) props.onChange(value)
  }, [value])

  return (
    <div className={cn("flex gap-1 flex-row", className)}>
      {options.map(opt => {
        const checked = multiple ? value.includes(opt.value) : opt.value === value
        return (
          <label key={opt.value}>
            <input
              className="sr-only peer"
              name={name}
              type={multiple ? "checkbox" : "radio"}
              value={opt.value}
              checked={checked}
              onChange={e => {
                if (e.target.checked) {
                  if (!multiple) {
                    return setValue(opt.value)

                  }
                  return setValue(multiple ? [...value, opt.value] : opt.value)
                } else {
                  if (multiple && typeof value === 'object') {
                    setValue(value.filter(v => v !== opt.value))
                  }
                }
              }}
            />
            <div className={cn(checkboxClasses, optionClassName, { [checkedClassName]: checked })}>
              {opt.label || opt.value}
            </div>
          </label>
        )
      })}
    </div>
  )
}

export default Select