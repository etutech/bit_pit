import { ElementType, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: ElementType
  center?: boolean
  between?: boolean
  start?: boolean
  end?: boolean
  right?: boolean
  wrap?: boolean
}

const Row = forwardRef<HTMLDivElement, IProps>(
  ({ className, children, center = true, as: Element = 'div', wrap, between, right, start, end, ...props }, ref) => {
    const classNames = cn(
      'flex flex-row relative',
      {
        'items-center': center && !end && !start,
        'items-start': start,
        'item-': end,
        'flex-wrap': wrap,
        'justify-between': between,
        'justify-end': right,
        'items-end': end
      },
      className
    )
    return (
      <Element ref={ref} className={classNames} {...props}>
        {children}
      </Element>
    )
  }
)
Row.displayName = "Row"

export { Row }