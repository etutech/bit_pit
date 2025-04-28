"use client"

import React, { useState } from 'react'
import { BaseProps } from "../type"
import { CopyCheckIcon, CopyIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1500)
    } catch (error) {
      setIsCopied(false)
      console.error('Unable to copy to clipboard:', error)
    }
  }

  return { isCopied, copyToClipboard }
}

interface IProps extends BaseProps {
  content: string
  copyText?: React.ReactNode
  copiedText?: React.ReactNode
}
const CopyToClipboardButton = ({ content, children, className, copyText, copiedText = 'Copied!' }: IProps) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <button type="button"
      className={cn('btn', { 'btn-secondary': isCopied }, className)}
      onClick={() => copyToClipboard(content)}
    >
      {isCopied ?
        <span className="flex items-center">
          <CopyCheckIcon size={16} className="mr-1" />{copiedText}
        </span> :
        (children ||
          <span className="flex items-center">
            <CopyIcon size={16} />
            <span className="ml-1 empty:hidden">{copyText}</span>
          </span>
        )
      }
    </button>
  )
}

export default CopyToClipboardButton