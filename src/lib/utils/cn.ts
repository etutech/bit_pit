import { twMerge } from "tailwind-merge"

export function cn(...args: unknown[]) {
  const classNames: string[] = []
  args.flat().forEach(arg => {
    if (typeof arg === 'string') {
      classNames.push(arg)
    } else if (typeof arg === 'object') {
      Object.keys(arg).forEach((key: string) => {
        if ((arg as any)[key]) classNames.push(key)
      })
    }
  })

  return twMerge(classNames.join(' ').trim())
}