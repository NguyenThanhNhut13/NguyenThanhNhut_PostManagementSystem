"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import type { RootState } from "../../store/store"
import { fetchPosts, deletePost, type Post } from "../../store/slices/postSlice"
import { addToast } from "../../store/slices/toastSlice"
import PostCard from "./PostCard"

const PostList: React.FC = () => {
  const dispatch = useDispatch()
  const { posts, loading, error, pagination } = useSelector((state: RootState) => state.posts)
  const { user } = useSelector((state: RootState) => state.auth)

  const [filters, setFilters] = useState({
    page: 0,
    size: 10,
    sortBy: "createdAt",
    direction: "desc",
    myPosts: false,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  useEffect(() => {
    dispatch(fetchPosts(filters) as any)
  }, [dispatch, filters])

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters, page: 0 })
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would be sent to the API
    dispatch(
      addToast({
        message: "Tính năng tìm kiếm sẽ được triển khai trong phiên bản tiếp theo",
        type: "info",
      }),
    )
  }

  const handleDeletePost = async (id: number) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")
    if (confirmed) {
      setIsDeleting(id)
      try {
        await dispatch(deletePost(id) as any).unwrap()
        dispatch(
          addToast({
            message: "Bài viết đã được xóa thành công",
            type: "success",
          }),
        )
      } catch (error: any) {
        dispatch(
          addToast({
            message: error.message || "Có lỗi xảy ra khi xóa bài viết",
            type: "error",
          }),
        )
      } finally {
        setIsDeleting(null)
      }
    }
  }

  if (loading && posts.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3 text-muted">Đang tải danh sách bài viết...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        <i className="fas fa-exclamation-triangle me-2"></i>
        <strong>Lỗi:</strong> {error}
        <div className="mt-2">
          <button className="btn btn-outline-danger btn-sm" onClick={() => dispatch(fetchPosts(filters) as any)}>
            <i className="fas fa-redo me-1"></i>
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">
          <i className="fas fa-list me-2"></i>
          {filters.myPosts ? "Bài Viết Của Tôi" : "Tất Cả Bài Viết"}
          {pagination.totalElements !== undefined && (
            <small className="text-muted ms-2">({pagination.totalElements} bài viết)</small>
          )}
        </h1>
        <Link to="/posts/create" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          Tạo Bài Viết Mới
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card mb-4">
        <div className="card-body">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="submit">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">
                <i className="fas fa-filter me-1"></i>
                Hiển thị:
              </label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="myPosts"
                  checked={filters.myPosts}
                  onChange={(e) => handleFilterChange({ myPosts: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="myPosts">
                  Chỉ bài viết của tôi
                </label>
              </div>
            </div>

            <div className="col-md-3">
              <label htmlFor="sortBy" className="form-label">
                <i className="fas fa-sort me-1"></i>
                Sắp xếp theo:
              </label>
              <select
                className="form-select"
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              >
                <option value="createdAt">Ngày tạo</option>
                <option value="title">Tiêu đề</option>
                <option value="updatedAt">Ngày cập nhật</option>
              </select>
            </div>

            <div className="col-md-3">
              <label htmlFor="direction" className="form-label">
                <i className="fas fa-sort-amount-down me-1"></i>
                Thứ tự:
              </label>
              <select
                className="form-select"
                id="direction"
                value={filters.direction}
                onChange={(e) => handleFilterChange({ direction: e.target.value })}
              >
                <option value="desc">Mới nhất</option>
                <option value="asc">Cũ nhất</option>
              </select>
            </div>

            <div className="col-md-3">
              <label htmlFor="size" className="form-label">
                <i className="fas fa-list-ol me-1"></i>
                Số bài/trang:
              </label>
              <select
                className="form-select"
                id="size"
                value={filters.size}
                onChange={(e) => handleFilterChange({ size: Number.parseInt(e.target.value) })}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading overlay for pagination */}
      {loading && posts.length > 0 && (
        <div className="position-relative">
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
            style={{ zIndex: 10 }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="row">
        {posts.map((post: Post) => (
          <div key={post.id} className="col-md-6 col-lg-4 mb-4">
            <PostCard post={post} currentUser={user} onDelete={handleDeletePost} isDeleting={isDeleting === post.id} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <nav aria-label="Phân trang bài viết" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${pagination.page === 0 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0 || loading}
                title="Trang trước"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </li>

            {/* Show page numbers with ellipsis for large page counts */}
            {(() => {
              const currentPage = pagination.page
              const totalPages = pagination.totalPages
              const pages = []

              if (totalPages <= 7) {
                // Show all pages if total is 7 or less
                for (let i = 0; i < totalPages; i++) {
                  pages.push(i)
                }
              } else {
                // Show first page, current page area, and last page with ellipsis
                if (currentPage <= 3) {
                  for (let i = 0; i < 5; i++) pages.push(i)
                  pages.push(-1) // ellipsis
                  pages.push(totalPages - 1)
                } else if (currentPage >= totalPages - 4) {
                  pages.push(0)
                  pages.push(-1) // ellipsis
                  for (let i = totalPages - 5; i < totalPages; i++) pages.push(i)
                } else {
                  pages.push(0)
                  pages.push(-1) // ellipsis
                  for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
                  pages.push(-2) // ellipsis
                  pages.push(totalPages - 1)
                }
              }

              return pages.map((page, index) => {
                if (page === -1 || page === -2) {
                  return (
                    <li key={`ellipsis-${index}`} className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )
                }
                return (
                  <li key={page} className={`page-item ${page === pagination.page ? "active" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(page)} disabled={loading}>
                      {page + 1}
                    </button>
                  </li>
                )
              })
            })()}

            <li className={`page-item ${pagination.page === pagination.totalPages - 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages - 1 || loading}
                title="Trang sau"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>

          <div className="text-center text-muted mt-2">
            Trang {pagination.page + 1} / {pagination.totalPages}
            {pagination.totalElements !== undefined && <span> - Tổng cộng {pagination.totalElements} bài viết</span>}
          </div>
        </nav>
      )}
    </div>
  )
}

export default PostList
