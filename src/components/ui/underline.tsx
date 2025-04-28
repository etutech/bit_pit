/* eslint-disable max-len */
import { cn } from "@/lib/utils/cn"
import { BaseProps } from "../type"

interface IProps extends BaseProps {
  color?: string, size?: number, height?: number, strokeWidth?: number, type?: 'default' | 'rotate'
}

const Underline = (props: IProps) => {
  const { className, color = 'currentColor', size = 86, strokeWidth = 4, style, type = 'default' } = props
  if (type === 'rotate') {
    return (
      <svg width={size} style={style} className={className} viewBox="0 0 575 286" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M560.057 43.0591C524.619 42.7906 350.109 107.493 349.572 107.225C348.23 105.614 439.243 62.1209 493.207 38.7635C546.902 15.6745 552.003 11.6474 537.774 4.39853C526.229 -1.50795 510.389 -0.434046 479.783 8.69415C331.047 52.4558 67.6714 149.913 11.2914 180.25C-9.11277 191.258 1.62655 200.923 20.4199 197.701C60.9598 190.99 198.688 138.905 238.691 125.481C209.427 143.201 115.46 191.258 20.4199 258.377C-17.1668 284.956 13.171 299.454 80.827 265.089C202.715 203.071 470.655 87.8946 558.715 59.4361C579.925 52.4558 580.462 43.0591 560.057 43.0591Z"
          fill={color} fill-opacity="0.94"
        />
      </svg>
    )
  }
  return (
    <svg width={size} style={style} className={className} viewBox="0 0 86 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M58.717 9.3223C49.5219 7.3564 39.2572 8.42312 29.9537 8.60366C27.2785 8.65563 24.5414 9.00212 21.8689 8.85376C21.5203 8.83448 19.9995 8.76218 19.7142 8.37583C19.677 8.32555 20.8629 8.12729 21.439 8.04249C22.5593 7.87758 23.679 7.75591 24.7983 7.58176C27.7411 7.12415 30.7352 6.90089 33.7038 6.6952C41.3239 6.16765 54.9558 4.54186 62.4033 6.83458C62.7723 6.94817 61.6315 6.81504 61.2456 6.80449C60.6115 6.7873 59.9778 6.76241 59.3436 6.74248C57.2751 6.67775 55.1891 6.56259 53.1205 6.5807C46.4538 6.63867 39.7636 6.36017 33.0986 6.60962C31.0931 6.68478 29.0939 6.84083 27.0875 6.90115C25.9253 6.93606 25.9774 6.96563 24.7763 6.92485C24.2555 6.90714 22.8114 7.06384 23.2233 6.74457C23.9488 6.1821 26.2161 6.32279 27.093 6.20803C31.097 5.68464 35.091 5.00115 39.1154 4.63395C49.4343 3.69242 59.9392 3.69021 70.2817 4.08411C74.5126 4.24525 78.7872 3.62196 83 4.12554C72.778 2.80535 62.1529 2.99279 51.8749 3.03096C40.3028 3.07395 28.7437 3.07681 17.1713 3.32066C12.4204 3.4207 7.76534 4.32547 3 4.25942"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

export default Underline

interface IUnderlineTextProps extends IProps {
  color?: string, left?: number, bottom?: number, textClassName?: string
}
export const UnderlineText = (props: IUnderlineTextProps) => {
  const { children, className, textClassName, color = '#FF8577', left = 16, bottom = -4, onClick, ...rest } = props
  return (
    <span className={cn("relative", className)} onClick={onClick}>
      <Underline className="absolute" style={{ left, bottom }}  {...rest} color={color} />
      <span className={cn("relative", textClassName)}>{children}</span>
    </span>
  )
}