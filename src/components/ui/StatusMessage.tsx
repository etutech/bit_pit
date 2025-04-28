import { ShieldAlertIcon, ShieldOffIcon, ShieldUserIcon, ShieldXIcon } from "lucide-react"
import Link from "next/link"
import { BaseProps } from "../type"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

const CODE_MAP = {
  401: {
    title: '未授权',
    msg: '请先登录.',
    icon: ShieldOffIcon
  },
  403: {
    title: '不允许访问',
    msg: '暂无权限访问此页面.',
    icon: ShieldUserIcon
  },
  404: {
    title: '页面不存在',
    msg: '未找到访问的页面.',
    icon: ShieldXIcon
  },
  500: {
    title: '出错啦',
    msg: '出现了未被捕获的错误.',
    icon: ShieldAlertIcon
  },
  200: {
    title: '',
    msg: '',
    icon: undefined as any
  }
}

interface IProps extends BaseProps {
  code?: keyof typeof CODE_MAP,
  title?: ReactNode,
  msg?: ReactNode,
  redirect?: string,
  error?: Error
}

const StatusMessage = (props: IProps) => {
  const { code = 403, error, msg, redirect, className, children } = props
  const { icon: Icon } = CODE_MAP[code]
  const title = props.title || CODE_MAP[code].title
  return (
    <div className={cn("hero min-h-screen bg-base-200 text-base-content -mt-16", className)}>
      <div className="text-center">
        <h1 className="text-4xl flex flex-row items-center relative justify-center">
          {Icon && <Icon className="text-primary mr-2" size={60} />}
          <span>{error?.message ?? title}</span>
        </h1>
        <p className="pt-8 text-xl">{msg || CODE_MAP[code].msg}</p>
        {redirect && <Link href={redirect}><button className="btn btn-primary">Go Back</button></Link>}
        {children}
      </div>
    </div>
  )
}

export default StatusMessage