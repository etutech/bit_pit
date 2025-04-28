'use client'
import React, { createContext, PropsWithChildren, useContext, useLayoutEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { type IMe } from '@/types/user'

export type ThemeType = 'light' | 'dark'


const AuthContext = createContext({
  me: null as IMe,
  theme: '',
  setUserContext: (_user?: IMe) => { },
  setTheme: (_theme: ThemeType) => { },
})

export const useAppContext = () => useContext(AuthContext)

interface IProviderProps extends PropsWithChildren {
  sessionUser: IMe,
  access_token?: string,
  defaultTheme?: ThemeType,
  className?: string
}

export const AppProvider = (props: IProviderProps) => {
  const { sessionUser, defaultTheme = "light", children } = props
  const [user, setUser] = useState(sessionUser)
  const [theme, setTheme] = useState(defaultTheme)

  const onChangeTheme = (_theme: ThemeType) => {
    document.documentElement.dataset.theme = _theme
    setTheme(_theme)
    Cookies.set('theme', _theme, { expires: 365 })
  }

  useLayoutEffect(() => {
    if (Cookies.get('theme')) return
    const matched = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (matched) {
      onChangeTheme('dark')
    } else {
      onChangeTheme('light')
    }
  }, [])

  const value = {
    me: user,
    theme,
    setUserContext: setUser,
    setTheme: onChangeTheme,
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}