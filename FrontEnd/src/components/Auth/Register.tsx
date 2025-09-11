"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import type { RootState } from "../../store/store"
import { register, clearError } from "../../store/slices/authSlice"
import { addToast } from "../../store/slices/toastSlice"

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
  })

  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
  })

  const [touched, setTouched] = useState({
    username: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false,
    email: false,
    gender: false,
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/posts")
      dispatch(
        addToast({
          message: "Đăng ký thành công! Chào mừng bạn đến với hệ thống.",
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

  const validateField = (name: string, value: string) => {
    let error = ""

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          error = "Họ không được để trống"
        } else if (value.length < 2) {
          error = "Họ phải có ít nhất 2 ký tự"
        }
        break
      case "lastName":
        if (!value.trim()) {
          error = "Tên không được để trống"
        } else if (value.length < 2) {
          error = "Tên phải có ít nhất 2 ký tự"
        }
        break
      case "username":
        if (!value.trim()) {
          error = "Tên đăng nhập không được để trống"
        } else if (value.length < 3) {
          error = "Tên đăng nhập phải có ít nhất 3 ký tự"
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"
        }
        break
      case "email":
        if (!value.trim()) {
          error = "Email không được để trống"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Email không đúng định dạng"
        }
        break
      case "password":
        if (!value) {
          error = "Mật khẩu không được để trống"
        } else if (value.length < 6) {
          error = "Mật khẩu phải có ít nhất 6 ký tự"
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
        }
        break
      case "confirmPassword":
        if (!value) {
          error = "Vui lòng xác nhận mật khẩu"
        } else if (value !== formData.password) {
          error = "Mật khẩu xác nhận không khớp"
        }
        break
      case "gender":
        if (!value) {
          error = "Vui lòng chọn giới tính"
        }
        break
    }

    return error
  }

  const validateForm = () => {
    const errors = { ...formErrors }
    let isValid = true

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData])
      errors[key as keyof typeof errors] = error
      if (error) isValid = false
    })

    setFormErrors(errors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value)
      setFormErrors({
        ...formErrors,
        [name]: error,
      })
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched({
      ...touched,
      [name]: true,
    })

    const error = validateField(name, value)
    setFormErrors({
      ...formErrors,
      [name]: error,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setTouched({
      username: true,
      password: true,
      confirmPassword: true,
      firstName: true,
      lastName: true,
      email: true,
      gender: true,
    })

    if (validateForm()) {
      const { confirmPassword, ...registerData } = formData
      dispatch(register(registerData) as any)
    } else {
      dispatch(
        addToast({
          message: "Vui lòng kiểm tra lại thông tin đăng ký",
          type: "error",
        }),
      )
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">
              <i className="fas fa-user-plus me-2"></i>
              Đăng Ký
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="firstName" className="form-label">
                    <i className="fas fa-user me-1"></i>
                    Họ
                  </label>
                  <input
                    type="text"
                    className={`form-control ${touched.firstName && formErrors.firstName ? "is-invalid" : ""}`}
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Nhập họ"
                    required
                  />
                  {touched.firstName && formErrors.firstName && (
                    <div className="invalid-feedback">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {formErrors.firstName}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="lastName" className="form-label">
                    <i className="fas fa-user me-1"></i>
                    Tên
                  </label>
                  <input
                    type="text"
                    className={`form-control ${touched.lastName && formErrors.lastName ? "is-invalid" : ""}`}
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Nhập tên"
                    required
                  />
                  {touched.lastName && formErrors.lastName && (
                    <div className="invalid-feedback">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {formErrors.lastName}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  <i className="fas fa-at me-1"></i>
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
                <label htmlFor="email" className="form-label">
                  <i className="fas fa-envelope me-1"></i>
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control ${touched.email && formErrors.email ? "is-invalid" : ""}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Nhập email"
                  required
                />
                {touched.email && formErrors.email && (
                  <div className="invalid-feedback">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {formErrors.email}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="gender" className="form-label">
                  <i className="fas fa-venus-mars me-1"></i>
                  Giới tính
                </label>
                <select
                  className={`form-select ${touched.gender && formErrors.gender ? "is-invalid" : ""}`}
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
                {touched.gender && formErrors.gender && (
                  <div className="invalid-feedback">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {formErrors.gender}
                  </div>
                )}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
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

                <div className="col-md-6 mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    <i className="fas fa-lock me-1"></i>
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    className={`form-control ${touched.confirmPassword && formErrors.confirmPassword ? "is-invalid" : ""}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                  {touched.confirmPassword && formErrors.confirmPassword && (
                    <div className="invalid-feedback">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {formErrors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Đang đăng ký...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus me-2"></i>
                    Đăng Ký
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="mb-0">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-decoration-none">
                  Đăng nhập tại đây
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
