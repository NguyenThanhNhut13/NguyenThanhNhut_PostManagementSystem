"use client"

import type React from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../store/store"
import { removeToast } from "../store/slices/toastSlice"
import Toast from "./Toast"

const ToastContainer: React.FC = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts)
  const dispatch = useDispatch()

  const handleCloseToast = (id: string) => {
    dispatch(removeToast(id))
  }

  return (
    <div 
      className="toast-container position-fixed top-0 end-0 p-3" 
      style={{ 
        zIndex: 9999,
        maxWidth: '350px',
        width: '100%',
        pointerEvents: 'auto'
      }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={handleCloseToast}
        />
      ))}
    </div>
  )
}

export default ToastContainer
