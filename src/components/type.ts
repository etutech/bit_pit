export type BaseProps = {
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  id?: string
  name?: string
  children?: React.ReactNode
}

export type PageProps<P = {}, S = {}> = {
  params: Promise<{ [key: string]: string | undefined } & P>
  searchParams: Promise<{ [key: string]: string | undefined } & S>
}
