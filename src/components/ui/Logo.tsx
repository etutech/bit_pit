import Link from "next/link"
import { cn } from "@/lib/utils"
import { BaseProps } from "../type"
import { SparklesIcon } from "lucide-react"

interface IProps extends BaseProps {
  icon?: React.ElementType,
  title?: string,
  path?: string
}
const Logo = (props: IProps) => {
  const { path, className, icon: Icon = SparklesIcon, title } = props
  const main = (
    <h1 className={cn("flex flex-row group text-primary", className)}>
      <Icon
        size={36}
        className={cn(
          "mr-2 fill-base-200",
          "group-hover:skew-y-6 group-hover:drop-shadow-2xl",
          "group-hover:fill-amber-100 group-hover:stroke-amber-300",
          "transition-all duration-200"
        )}
      />
      <span className={cn(
        "text-4xl",
        "group-hover:ml-1 group-hover:text-amber-500 group-hover:font-extrabold",
        "transition-all duration-300"
      )}>{title}</span>
    </h1>
  )

  if (!path) return main

  return <Link href={path}>{main}</Link>
}

export default Logo