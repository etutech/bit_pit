"use client"
import { PropsWithChildren } from "react"
import { useAppContext } from "."
import NotAllowed from "@/components/403"

interface AuthGuardProps extends PropsWithChildren {
  msg?: string
  redirect?: string
}
const AuthGuard = (props: AuthGuardProps) => {
  const { me } = useAppContext()
  if (!me) return null
  if (0) {
    return <NotAllowed msg={props.msg} redirect={props.redirect} />
  }
  return props.children
}

export default AuthGuard