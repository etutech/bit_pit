"use client"
import { PropsWithChildren } from "react"
import { useAppContext } from "."
import NotAllowed from "@/components/ui/StatusMessage"

interface AuthGuardProps extends PropsWithChildren {
  msg?: string
  redirect?: string
}
const AuthGuard = (props: AuthGuardProps) => {
  const { me } = useAppContext()
  if (!me) return null
  if (0) {
    return <NotAllowed code={403} msg={props.msg} redirect={props.redirect} />
  }
  return props.children
}

export default AuthGuard