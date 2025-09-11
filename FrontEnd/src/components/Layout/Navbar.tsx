"use client"

import type React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store/store"
import { logout } from "../../store/slices/authSlice"

const Navbar: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-blog me-2"></i>
          Post Management
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/posts">
                    <i className="fas fa-list me-1"></i>
                    All Posts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/posts/create">
                    <i className="fas fa-plus me-1"></i>
                    Create Post
                  </Link>
                </li>
                {user?.role === "ROLE_ADMIN" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/users">
                      <i className="fas fa-users me-1"></i>
                      Manage Users
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i className="fas fa-user me-1"></i>
                  {user?.firstName} {user?.lastName}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-1"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="fas fa-user-plus me-1"></i>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
