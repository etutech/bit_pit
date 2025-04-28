const isProduction = process.env.NODE_ENV === 'production'
const isInBrowser = typeof window !== 'undefined'

type NS = 'log' | 'success' | 'info' | 'error' | 'warning' | 'fatal'

// Colors
const COLORS = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",
  FgGray: "\x1b[90m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
  BgGray: "\x1b[100m",
} as const

const BG_COLORS: Record<NS, string> = {
  'log': '#777777',
  'success': '#00CC00',
  'info': '#0099CC',
  'error': '#CC3333',
  'warning': '#CC9900',
  'fatal': '#FF0000',
}

// level
const LOG_LEVEL = {
  fatal: 0,
  error: 1,
  warning: 2,
  log: 3,
  info: 4,
  success: 5,
} as const
type Keys = keyof typeof LOG_LEVEL
let logLevel: -1 | typeof LOG_LEVEL[Keys] = isProduction ? LOG_LEVEL.error : LOG_LEVEL.success

// log_in_browser
function LB(ns: NS, ...args: any) {
  const bgcolor = BG_COLORS[ns]
  const l = [
    `%cLogger%c${ns}%c`,
    "background:#555555 ; padding: 1px 5px; border-radius: 1px 0 0 1px; color: #fff",
    `background:${bgcolor}; padding: 1px 5px; border-radius: 0 1px 1px 0; color: #fff`,
    'background:transparent'
  ]
  l.push(...args)

  if (ns === 'error' || ns === 'fatal') {
    console.error(...l)
  } else if (ns === 'warning') {
    console.warn(...l)
  } else if (ns === 'info') {
    console.info(...l)
  } else {
    console.log(...l)
  }
}


const log = (...args: any) => {
  if (logLevel < LOG_LEVEL.log) return
  if (isInBrowser) {
    LB('log', ...args)
  } else {
    console.log(`${COLORS.BgGray} log ${COLORS.Reset}`, ...args, COLORS.Reset)
  }
}
const warn = (...args: any) => {
  if (logLevel < LOG_LEVEL.warning) return
  if (isInBrowser) {
    LB('warning', ...args)
  } else {
    console.log(`${COLORS.BgYellow}warn ${COLORS.Reset}`, ...args, COLORS.Reset)
  }
}

const success = (...args: any) => {
  if (logLevel < LOG_LEVEL.success) return
  if (isInBrowser) {
    LB('success', ...args)
  } else {
    console.log(`${COLORS.BgGreen}success${COLORS.Reset}`, ...args, COLORS.Reset)
  }
}

const info = (...args: any) => {
  if (logLevel < LOG_LEVEL.info) return
  if (isInBrowser) {
    LB('info', ...args)
  } else {
    console.log(`${COLORS.BgCyan}info ${COLORS.Reset}`, ...args, COLORS.Reset)
  }
}

const error = (...args: any) => {
  if (logLevel < LOG_LEVEL.error) return
  if (isInBrowser) {
    LB('error', ...args)
  } else {
    console.log(`${COLORS.BgMagenta}error${COLORS.Reset}`, ...args, COLORS.Reset)
  }
}

const fatal = (...args: any) => {
  if (logLevel < LOG_LEVEL.fatal) return
  if (isInBrowser) {
    LB('fatal', ...args)
  } else {
    console.log(`${COLORS.BgRed}fatal${COLORS.Reset}`, ...args, COLORS.Reset)
  }
}

export default {
  setLevel: (level: typeof logLevel) => {
    logLevel = level
  },
  log,
  success,
  info,
  error,
  warning: warn,
  fatal
}

