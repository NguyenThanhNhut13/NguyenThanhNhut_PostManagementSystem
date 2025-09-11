"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import type { RootState } from "../../store/store"
import { fetchPostById, updatePost, clearCurrentPost } from "../../store/slices/postSlice"
import { addToast } from "../../store/slices/toastSlice"

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { currentPost, loading } = useSelector((state: RootState) => state.posts)
  const { user } = useSelector((state: RootState) => state.auth)

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

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(Number.parseInt(id)) as any)
    }

    return () => {
      dispatch(clearCurrentPost())
    }
  }, [dispatch, id])

  useEffect(() => {
    if (currentPost) {
      // Check if user can edit this post
      const isOwner = user?.username === currentPost.author.username
      const isAdmin = user?.role === "ROLE_ADMIN"
      const canEdit = isOwner || isAdmin
      
      console.log("Edit permission check:", { 
        currentUser: user, 
        postAuthor: currentPost.author, 
        isOwner, 
        isAdmin, 
        canEdit 
      })
      
      if (!canEdit) {
        dispatch(
          addToast({
            message: "Bạn không có quyền chỉnh sửa bài viết này",
            type: "error",
          }),
        )
        navigate("/posts")
        return
      }

      setFormData({
        title: currentPost.title,
        content: currentPost.content,
      })
    }
  }, [currentPost, user, navigate, dispatch])

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

    if (validateForm() && id) {
      setSubmitting(true)
      try {
        const result = await dispatch(updatePost({ id: Number.parseInt(id), postData: formData }) as any).unwrap()
        console.log("Update result:", result)
        
        dispatch(
          addToast({
            message: "Bài viết đã được cập nhật thành công!",
            type: "success",
          }),
        )
        
        // Wait for state updates before navigating
        setTimeout(() => {
          navigate(`/posts/${id}`, { replace: true })
        }, 300)
      } catch (error: any) {
        console.error("Error updating post:", error)
        dispatch(
          addToast({
            message: error.message || "Có lỗi xảy ra khi cập nhật bài viết",
            type: "error",
          }),
        )
        setSubmitting(false)
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2 text-muted">Đang tải bài viết...</p>
        </div>
      </div>
    )
  }

  if (!currentPost) {
    return (
      <div className="alert alert-warning text-center">
        <i className="fas fa-exclamation-triangle me-2"></i>
        Không tìm thấy bài viết
      </div>
    )
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow">
          <div className="card-body">
            <h2 className="card-title mb-4">
              <i className="fas fa-edit me-2"></i>
              Chỉnh Sửa Bài Viết
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
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => navigate(`/posts/${id}`)}
                  disabled={submitting}
                >
                  <i className="fas fa-times me-2"></i>
                  Hủy
                </button>

                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Cập Nhật Bài Viết
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

export default EditPost