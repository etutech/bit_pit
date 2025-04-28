"use client"
import dynamic from 'next/dynamic'

const LightBurnEditor = dynamic(() => import("@/components/editor/KonvaEditor"), { ssr: false })
export default LightBurnEditor
