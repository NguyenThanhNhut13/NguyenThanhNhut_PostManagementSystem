"use client"

import type React from "react"
import { useEffect } from "react"

export interface ToastProps {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const getToastClass = () => {
    switch (type) {
      case "success":
        return "alert-success"
      case "error":
        return "alert-danger"
      case "warning":
        return "alert-warning"
      case "info":
        return "alert-info"
      default:
        return "alert-info"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return "fas fa-check-circle"
      case "error":
        return "fas fa-exclamation-circle"
      case "warning":
        return "fas fa-exclamation-triangle"
      case "info":
        return "fas fa-info-circle"
      default:
        return "fas fa-info-circle"
    }
  }

  return (
    <div className={`alert ${getToastClass()} alert-dismissible fade show toast-notification`} role="alert">
      <i className={`${getIcon()} me-2`}></i>
      {message}
      <button type="button" className="btn-close" onClick={() => onClose(id)} aria-label="Close"></button>
    </div>
  )
}

export default Toast