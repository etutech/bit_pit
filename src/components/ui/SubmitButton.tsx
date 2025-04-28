"use client"

import { useFormStatus } from 'react-dom'
import { BaseProps } from "../type"

interface IProps extends BaseProps { loadingText?: string }

const SubmitButton = ({ children, loadingText, ...rest }: IProps) => {
  const { pending } = useFormStatus()
  return (
    <button type="submit" {...rest}>
      {(pending && loadingText) || children}
    </button>
  )
}
export default SubmitButton