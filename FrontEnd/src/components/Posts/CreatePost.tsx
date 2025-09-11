"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { RootState } from "../../store/store"
import { createPost } from "../../store/slices/postSlice"
import { addToast } from "../../store/slices/toastSlice"

const CreatePost: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  })

  const [formErrors, setFormErrors] = useState({
    title: "",
    content: "",
  })

  const [touched, setTouched] = useState({
    title: false,
    content: false,
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state: RootState) => state.posts)

  const validateField = (name: string, value: string) => {
    let error = ""

    switch (name) {
      case "title":
        if (!value.trim()) {
          error = "Tiêu đề không được để trống"
        } else if (value.trim().length < 3) {
          error = "Tiêu đề phải có ít nhất 3 ký tự"
        } else if (value.trim().length > 200) {
          error = "Tiêu đề không được vượt quá 200 ký tự"
        }
        break
      case "content":
        if (!value.trim()) {
          error = "Nội dung không được để trống"
        } else if (value.trim().length < 10) {
          error = "Nội dung phải có ít nhất 10 ký tự"
        } else if (value.trim().length > 5000) {
          error = "Nội dung không được vượt quá 5000 ký tự"
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setTouched({
      title: true,
      content: true,
    })

    if (validateForm()) {
      try {
        await dispatch(createPost(formData) as any).unwrap()
        dispatch(
          addToast({
            message: "Bài viết đã được tạo thành công!",
            type: "success",
          }),
        )
        navigate("/posts")
      } catch (error: any) {
        dispatch(
          addToast({
            message: error.message || "Có lỗi xảy ra khi tạo bài viết",
            type: "error",
          }),
        )
      }
    } else {
      dispatch(
        addToast({
          message: "Vui lòng kiểm tra lại thông tin bài viết",
          type: "error",
        }),
      )
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow">
          <div className="card-body">
            <h2 className="card-title mb-4">
              <i className="fas fa-plus me-2"></i>
              Tạo Bài Viết Mới
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  <i className="fas fa-heading me-1"></i>
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  className={`form-control ${touched.title && formErrors.title ? "is-invalid" : ""}`}
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Nhập tiêu đề bài viết..."
                  required
                />
                {touched.title && formErrors.title && (
                  <div className="invalid-feedback">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {formErrors.title}
                  </div>
                )}
                <div className="form-text">{formData.title.length}/200 ký tự</div>
              </div>

              <div className="mb-4">
                <label htmlFor="content" className="form-label">
                  <i className="fas fa-align-left me-1"></i>
                  Nội dung *
                </label>
                <textarea
                  className={`form-control ${touched.content && formErrors.content ? "is-invalid" : ""}`}
                  id="content"
                  name="content"
                  rows={10}
                  value={formData.content}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Viết nội dung bài viết tại đây..."
                  required
                ></textarea>
                {touched.content && formErrors.content && (
                  <div className="invalid-feedback">
                    <i className="fas fa-exclamation-circle me-1"></i>
                    {formErrors.content}
                  </div>
                )}
                <div className="form-text">{formData.content.length}/5000 ký tự</div>
              </div>

              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/posts")}>
                  <i className="fas fa-times me-2"></i>
                  Hủy
                </button>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Tạo Bài Viết
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
