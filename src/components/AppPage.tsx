import { cn } from "@/lib/utils"
import { type ReactNode } from "react"
import { type BaseProps } from "./type"
import Helmet from "./ui/Helmet"

interface IAppLoadingProps extends BaseProps {
  size?: number; height?: number | string, duration?: number, className?: string
}

export const AppLoading = (props: IAppLoadingProps) => {
  const { height = 200, className, children } = props

  return (
    <div
      className={cn("w-full flex flex-col items-center justify-center py-10", className)}
      style={{ minHeight: height }}
    >
      {/* {children || <Loader2 className="animate-spin text-primary" style={{ fontSize: '2rem' }} />} */}
      {children || (
        <div className="spinner--colorful">
          <div className="spinner__outer circles">
            <svg width="100" height="100" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg"
              className="spinner__inner"
            >
              <circle cx="50" cy="50" r="37" className="twirl l1"></circle>
              <circle cx="50" cy="50" r="30" className="twirl l2"></circle>
              <circle cx="50" cy="50" r="20" className="twirl l3"></circle>
              <circle cx="50" cy="50" r="12" className="pulse dot"></circle>
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

export interface IAppPageProps extends BaseProps {
  /** 文档标题设置 */
  title?: string
  description?: string
  fullscreen?: boolean
  /** 文档 favicon 设置 */
  icon?: string
  loading?: boolean | ReactNode
  loadingHeight?: string | number
}

/** 页面外包组件
 * @param title? 文档标题
 * @param icon? 文档 favicon
 * @param loading? 是否为加载状态， 有 children 时，居中展示提示信息, 无 children 时 显示加载动画
 */
const AppPage = (props: IAppPageProps) => {
  const {
    children, className, loading, fullscreen, style,
    loadingHeight = '80vh'
  } = props

  let element = children
  if (loading) {
    if (!children) {
      element = <AppLoading height={loadingHeight} />
    } else {
      element = children
    }
  }

  const classes = cn('safeArea flex flex-col flex-1', { 'min-h-screen': fullscreen }, className)
  const hasHelmet = props.title || props.description || props.icon
  return (
    <>
      {hasHelmet && <Helmet title={props.title} description={props.description} icon={props.icon} />}
      <main className={classes} style={style}>
        {element}
      </main>
    </>
  )
}

export default AppPage
