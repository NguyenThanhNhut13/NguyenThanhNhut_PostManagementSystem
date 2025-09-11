"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import type { RootState } from "../../store/store"
import { login, clearError, fetchCurrentUser } from "../../store/slices/authSlice"
import { addToast } from "../../store/slices/toastSlice"

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
  })
  const [touched, setTouched] = useState({
    username: false,
    password: false,
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/posts")
      dispatch(
        addToast({
          message: "Đăng nhập thành công!",
          type: "success",
        }),
      )
    }
  }, [isAuthenticated, navigate, dispatch])

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      dispatch(
        addToast({
          message: error,
          type: "error",
        }),
      )
    }
  }, [error, dispatch])

  const validateForm = () => {
    const errors = {
      username: "",
      password: "",
    }

    if (!formData.username.trim()) {
      errors.username = "Tên đăng nhập không được để trống"
    } else if (formData.username.length < 3) {
      errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự"
    }

    if (!formData.password) {
      errors.password = "Mật khẩu không được để trống"
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự"
    }

    setFormErrors(errors)
    return !errors.username && !errors.password
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (touched[name as keyof typeof touched]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched({
      ...touched,
      [name]: true,
    })
    validateForm()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setTouched({
      username: true,
      password: true,
    })

    if (validateForm()) {
      dispatch(login(formData) as any)
      .unwrap()
      .then(() => {
        dispatch(fetchCurrentUser() as any);
      })
      .catch((error: any) => {
        console.error("Login failed:", error);
      }); 
    } else {
      dispatch(
        addToast({
          message: "Vui lòng kiểm tra lại thông tin đăng nhập",
          type: "error",
        }),
      )
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">
              <i className="fas fa-sign-in-alt me-2"></i>
              Đăng Nhập
            </h2>

            <div className="alert alert-info">
              <strong>Thông tin đăng nhập thử nghiệm:</strong>
              <ul>
                <li>Admin: admin / admin123</li>
                <li>Người dùng: user / user123</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  <i className="fas fa-user me-1"></i>
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  className={`form-control ${touched.username && formErrors.username ? "is-invalid" : ""}`}
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
                {touched.username && formErrors.username && (
                  <div className="invalid-feedback">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {formErrors.username}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  <i className="fas fa-lock me-1"></i>
                  Mật khẩu
                </label>
                <input
                  type="password"
                  className={`form-control ${touched.password && formErrors.password ? "is-invalid" : ""}`}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Nhập mật khẩu"
                  required
                />
                {touched.password && formErrors.password && (
                  <div className="invalid-feedback">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {formErrors.password}
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Đăng Nhập
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="mb-0">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="text-decoration-none">
                  Đăng ký tại đây
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
