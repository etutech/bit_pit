"use client"

import { cn } from "@/lib/utils"
import { ReactNode, useEffect, useReducer } from "react"
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XCircleIcon, XIcon } from "lucide-react"
import { v4 } from 'uuid'
import eventBus from "@/lib/events/eventBus"

type ToastPosition = 'tr' | 'tl' | 'br' | 'bl' | 'tc' | 'bc' | 'center'
type ToastType = 'show' | 'success' | 'error' | 'info' | 'warn'
interface ToastOption {
  type?: ToastType
  message: ReactNode
  mask?: boolean
  position?: ToastPosition
  autoClose?: number | boolean
}
interface IToast extends ToastOption { id: string }
type ToastHandler = (message: ReactNode, option?: Omit<ToastOption, 'message'>) => ({ destroy: () => void, id: string })

interface IToastHandlers {
  show: ToastHandler,
  remove: (id?: string) => void,
  success: ToastHandler,
  error: ToastHandler,
  info: ToastHandler,
  warn: ToastHandler
}

type ActionType =
  { type: 'ADD_TOAST', payload: IToast } |
  { type: 'REMOVE_TOAST', payload?: string } |
  { type: 'SET_POSITION', payload?: ToastPosition }

/** Defaults */
const DEFAULT_DURATION = 5000
const DEFAULT_POSITION = 'tr' as ToastPosition

const show = (message: ReactNode, option: Omit<ToastOption, 'message'>) =>
  eventBus.fire(eventBus.events.SHOW_TOAST, { message, type: 'show', ...option })

const toast = {
  show,
  remove: (id?: string) => eventBus.fire(eventBus.events.REMOVE_TOAST, id),
} as IToastHandlers

(['success', 'error', 'warn', 'info'] as ToastType[]).forEach(type => {
  toast[type] = (message, option) => show(message, { type, ...option })
})

export default toast

const ToastTypesConfig = {
  show: {
    icon: null as ReactNode,
    bgClass: "bg-base-content text-base-100"
  },
  success: {
    icon: <CheckCircle2Icon className="stroke-current shrink-0 h-6 w-6 " />,
    bgClass: "bg-success text-success-content",
  },
  warn: {
    icon: <AlertTriangleIcon className="stroke-current shrink-0 h-6 w-6 " />,
    bgClass: "bg-warning text-warning-content",
  },
  info: {
    icon: <InfoIcon className="stroke-current shrink-0 h-6 w-6" />,
    bgClass: "bg-info text-info-content",
  },
  error: {
    icon: <XCircleIcon className="stroke-current shrink-0 h-6 w-6" />,
    bgClass: "bg-error text-error-content",
  }
}

const Toast = (props: IToast) => {
  const { id, message, type, autoClose } = props
  const duration = !autoClose ? -1 : (typeof autoClose === 'number' ? autoClose : DEFAULT_DURATION)
  const { icon, bgClass } = ToastTypesConfig[type]
  const alertHoverClass = "hover:shadow-xl hover:bg-opacity-100 hover:backdrop-blur-none transition-all"
  const alertClasses = cn(
    'alert border-none rounded-md',
    'shadow-lg bg-opacity-85 backdrop-blur',
    alertHoverClass,
    bgClass
  )
  const { remove } = toast
  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(() => remove(id), duration)
    return () => clearTimeout(timer)
  }, [duration])
  return (
    <div className={alertClasses}>
      {icon}<pre>{message}</pre>
      {!duration && <XIcon onClick={() => remove(id)} className="cursor-pointer hover:text-white" />}
    </div>
  )

}

const initialState = { toasts: [] as IToast[], mask: false, position: DEFAULT_POSITION }

const toastReducer = (state: typeof initialState, action: ActionType) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        position: action.payload.position || DEFAULT_POSITION,
        mask: action.payload.mask || false,
        toasts: [...state.toasts, action.payload],
      }
    case "REMOVE_TOAST":
      return {
        ...state,
        position: DEFAULT_POSITION,
        mask: false,
        toasts: !action.payload ? [] : state.toasts.filter(toast => toast.id !== action.payload),
      }
    default:
      throw new Error(`Unhandled action type: ${JSON.stringify(action)}`)
  }
}

export const ToastContainer = () => {
  const [state, dispatch] = useReducer(toastReducer, initialState)
  // ADD
  const addToast = (type: ToastType, message: ReactNode, option: Partial<ToastOption>) => {
    const id = v4()
    dispatch({ type: "ADD_TOAST", payload: { autoClose: 4000, ...option, message, id, type } })
    return { id, destroy: () => dispatch({ type: "REMOVE_TOAST", payload: id }) }
  }
  // REMOVE
  const removeToast = (id?: string) => dispatch({ type: "REMOVE_TOAST", payload: id })

  // EFFECT
  useEffect(() => {
    eventBus.on(eventBus.events.SHOW_TOAST, (option: ToastOption) => {
      const { type, message, ...rest } = option
      return addToast(type, message, rest)
    })
    eventBus.on(eventBus.events.REMOVE_TOAST, (id?: string) => {
      return removeToast(id)
    })
    return () => {
      eventBus.off(eventBus.events.SHOW_TOAST)
      eventBus.off(eventBus.events.REMOVE_TOAST)
    }
  }, [])

  const { position, toasts, mask } = state
  const postionClasses = cn({
    'toast-top': position[0] === 't',
    'toast-bottom': position[0] === 'b',
    'toast-start': position[1] === 'l',
    'toast-end': position[1] === 'r',
    'toast-center': position[1] === 'c',
    'toast-middle toast-center': position === 'center'
  })
  return (
    <>
      {mask && (
        <div className="fixed top-0 left-0  w-screen h-screen bg-black bg-opacity-70 backdrop-blur"
          style={{ zIndex: '9998' }}
        />
      )}
      <div
        className={`toast ${cn(postionClasses)} max-h-screen overflow-y-auto empty:hidden pb-6`}
        style={{ zIndex: '9999' }}
      >
        {toasts.map((toast) => <Toast key={toast.id} {...toast} />)}
      </div>
    </>
  )
}
