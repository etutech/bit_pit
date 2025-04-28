"use client"

import { cloneElement, ReactElement, ReactNode, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { createPortal } from "react-dom"

interface ModalProps {
  modalClassName?: string
  className?: string
  closable?: boolean
  maskClosable?: boolean
  children: ReactElement<any>
  defaultOpened?: boolean
  customCloseBtn?: boolean
  body?: ReactNode
}

export interface ModalContentProps {
  onClose?: () => void
}

const customCloseButton = "btn btn-sm btn-circle btn-neutral absolute -top-2 -right-2 border-2 " +
  "border-white shadow-xl hover:animate-spin"

export const DialogModal = (props: ModalProps & { maskClosable?: boolean }) => {
  const [mounted, setMounted] = useState(false)
  const {
    className, modalClassName, children, body, customCloseBtn,
    closable = true, maskClosable = true,
  } = props
  const dialogRef = useRef<HTMLDialogElement>(null)
  const handleOpen = () => {
    if (dialogRef.current) dialogRef.current.showModal()
  }
  useEffect(() => {
    setMounted(true)
    if (props.defaultOpened) handleOpen()
  }, [props.defaultOpened])


  const Trigger = cloneElement(children, { onClick: handleOpen })

  const Dialog = (
    <dialog className={cn("modal", modalClassName)} ref={dialogRef}>
      <div className={cn("modal-box", className)} style={{ overflow: customCloseBtn ? 'unset' : undefined }}>
        {body}
        {closable && (
          <form method="dialog">
            {customCloseBtn ? <button className={customCloseButton}><X /></button> :
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            }
          </form>
        )}
      </div>
      {maskClosable && <form method="dialog" className="modal-backdrop"><button>close</button></form>}
    </dialog>
  )

  return mounted ? (
    <>
      {Trigger}
      {createPortal(Dialog, document.body)}
    </>
  ) : null
}

export default DialogModal