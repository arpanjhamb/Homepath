"use client"
import * as React from "react"
import type { ToastProps } from "@/components/ui/toast"

type ToastInput = Pick<ToastProps, "variant"> & { title: string; description?: string }

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 4000

type ToastState = ToastInput & { id: string; open: boolean }
type Action =
  | { type: "ADD"; toast: ToastState }
  | { type: "DISMISS"; id: string }
  | { type: "REMOVE"; id: string }

let count = 0
const genId = () => String(++count)

const listeners: Array<(state: ToastState[]) => void> = []
let memoryState: ToastState[] = []

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((l) => l(memoryState))
}

function reducer(state: ToastState[], action: Action): ToastState[] {
  switch (action.type) {
    case "ADD":
      return [action.toast, ...state].slice(0, TOAST_LIMIT)
    case "DISMISS":
      return state.map((t) => (t.id === action.id ? { ...t, open: false } : t))
    case "REMOVE":
      return state.filter((t) => t.id !== action.id)
  }
}

export function toast(input: ToastInput) {
  const id = genId()
  dispatch({ type: "ADD", toast: { ...input, id, open: true } })
  setTimeout(() => dispatch({ type: "DISMISS", id }), TOAST_REMOVE_DELAY)
  setTimeout(() => dispatch({ type: "REMOVE", id }), TOAST_REMOVE_DELAY + 300)
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastState[]>(memoryState)
  React.useEffect(() => {
    listeners.push(setToasts)
    return () => { const i = listeners.indexOf(setToasts); if (i > -1) listeners.splice(i, 1) }
  }, [])
  return { toasts }
}
