import { Caveat_Brush, Inter, Nunito, Roboto } from "next/font/google"

import localFont from 'next/font/local'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap'
})

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

const caveatBrush = Caveat_Brush({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-caveat-brush',
  display: 'swap'
})

const popins = localFont({
  variable: '--font-poppins',
  adjustFontFallback: 'Arial',
  display: 'swap',
  src: [
    {
      path: '../styles/fonts/poppins/Poppins-Bol.woff2', weight: '600', style: 'italic'
    },
    {
      path: '../styles/fonts/poppins/Poppins-Bol.woff2', weight: 'bold', style: 'italic'
    },
  ]
})

export default {
  default: inter,
  caveatBrush,
  inter,
  popins,
  roboto,
  nunito
}