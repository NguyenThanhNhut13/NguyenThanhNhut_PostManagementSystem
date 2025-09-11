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
    <div 
      className={`alert ${getToastClass()} fade show toast-notification`} 
      role="alert"
      style={{ 
        marginBottom: '10px',
        position: 'relative',
        padding: '0.75rem 1.25rem'
      }}
    >
      <div className="d-flex justify-content-between align-items-center w-100">
        <div className="toast-content">
          <i className={`${getIcon()} me-2`}></i>
          <span>{message}</span>
        </div>
        <button 
          type="button" 
          onClick={() => onClose(id)}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'transparent',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            color: 'inherit',
            opacity: '0.5',
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default Toast