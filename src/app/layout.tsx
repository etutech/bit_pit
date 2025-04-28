import React, { PropsWithChildren, ReactNode } from 'react'
import { cookies, headers } from 'next/headers'
import type { Metadata } from 'next'

import { AppProvider, type ThemeType } from '@/context'
import GlobalUI from '@/components/GlobalUI'
import fonts from "@/lib/fonts"

import '@/styles/app.css'
import { IMe } from "@/types/user"
import { cn } from "@/lib/utils"


export const metadata: Metadata = {
  title: 'Bit Pit',
  description: 'blur blur blur',
  icons: ['/logo.png']
}


const getThemeFromCookie = async () => {
  const theme = (await cookies()).get('theme')?.value
  return theme as ThemeType
}

const RootLayout = async (props: PropsWithChildren & { teacher: ReactNode, student: ReactNode }) => {
  // inject x-path-name in middleware.ts
  const headersList = await headers()
  const pathname = headersList.get('x-path-name')
  // // React 18 above will render twice in development-only strict mode
  if (!pathname) return <html suppressHydrationWarning><body></body></html>

  // server side get user data & theme & locale messages
  const theme = await getThemeFromCookie()

  const bodyClassName = cn(`min-h-screen min-w-80 flex flex-col ENV--${process.env.NODE_ENV}`)
  const fontVariables = Object.values(fonts).map(font => font.variable).join(' ')
  return (
    <html
      suppressHydrationWarning
      className={`${fonts.default.className} ${fontVariables}`}
      data-theme={theme}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={bodyClassName}>
        <AppProvider sessionUser={{ name: 'handy', role: 'admin' } as IMe} defaultTheme={theme} access_token="">
          {props.children}
          <GlobalUI />
        </AppProvider>
      </body>
    </html>
  )
}

export default RootLayout