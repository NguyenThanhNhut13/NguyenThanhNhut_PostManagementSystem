import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
// import postReducer from "./slices/postSlice"
// import userReducer from "./slices/userSlice"
import toastReducer from "./slices/toastSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // posts: postReducer,
    // users: userReducer,
    toast: toastReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
