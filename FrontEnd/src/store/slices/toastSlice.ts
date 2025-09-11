import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
}

interface ToastState {
  toasts: Toast[]
}

const initialState: ToastState = {
  toasts: [],
}

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
      // Generate a truly unique ID by combining timestamp and random string
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      
      // Check for duplicate message (prevents double notifications)
      const isDuplicate = state.toasts.some(
        (toast) => 
          toast.message === action.payload.message && 
          toast.type === action.payload.type
      );
      
      // Only add if not a duplicate
      if (!isDuplicate) {
        const toast: Toast = {
          ...action.payload,
          id,
        };
        state.toasts.push(toast);
      }
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
})

export const { addToast, removeToast, clearToasts } = toastSlice.actions
export default toastSlice.reducer
