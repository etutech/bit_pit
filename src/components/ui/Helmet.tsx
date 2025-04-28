"use client"

import { useEffect } from "react"

interface HelmetProps {
  title?: string
  description?: string
  icon?: string
  keywords?: string[]
}

const Helmet = (props: HelmetProps) => {
  // const { title, description, icon, keywords } = props

  useEffect(() => {
    const { title, description, icon, keywords } = props
    console.log('title', title)
    if (title && document.title !== title) document.title = title
    if (icon) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
      if (link && link.href !== icon) link.href = icon
    }
    if (description) {
      const meta = document.querySelector("meta[name='description']") as HTMLMetaElement
      if (meta) meta.content = description.slice(0, 100)
    }
    if (keywords) {
      const meta = document.querySelector("meta[name='keywords']") as HTMLMetaElement
      if (meta) meta.content = keywords.join(", ")
    }
  }, [props])

  return <></>
}

export default Helmet