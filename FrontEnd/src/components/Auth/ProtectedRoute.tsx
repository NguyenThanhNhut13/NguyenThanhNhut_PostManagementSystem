import type React from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import type { RootState } from "../../store/store"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

export default ProtectedRoute
