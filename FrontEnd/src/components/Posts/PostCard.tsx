"use client"

import type React from "react"
import { Link } from "react-router-dom"

interface Post {
  id: number
  title: string
  content: string
  author: {
    id: number
    username: string
    firstName: string
    lastName: string
  }
  createdAt: string
  updatedAt: string
}

interface User {
  id: number
  username: string
  role?: string
}

interface PostCardProps {
  post: Post
  currentUser: User | null
  onDelete: (id: number) => void
  isDeleting?: boolean
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onDelete, isDeleting = false }) => {
  // Debug log to help diagnose issues with post data
  if (!post.author) {
    console.warn(`Post ID ${post.id} has missing author data:`, post);
  }

  // Add null checks to prevent accessing properties of undefined
  const isOwner = currentUser?.username && post?.author?.username 
    ? currentUser.username === post.author.username 
    : false
  const isAdmin = currentUser?.role === "ROLE_ADMIN"
  const canEdit = isOwner || isAdmin
  const canDelete = isOwner || isAdmin

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Vừa xong"
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} giờ trước`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} ngày trước`

    return formatDate(dateString)
  }

  return (
    <div className={`card h-100 post-card ${isDeleting ? "opacity-50" : ""}`}>
      <img
        src="/blog-post-thumbnail.png"
        className="card-img-top post-image"
        alt="Ảnh bài viết"
        style={{ height: "200px", objectFit: "cover" }}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate" title={post.title}>
          {post.title}
        </h5>
        <div className="card-text">
          <div className="d-flex align-items-center mb-2">
            <div
              className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
              style={{ width: "32px", height: "32px" }}
            >
              <i className="fas fa-user text-white small"></i>
            </div>
            <div>
              <small className="text-muted d-block">
                <strong>
                  {post.author?.firstName || "Unknown"} {post.author?.lastName || ""}
                </strong>
                {isOwner && <span className="badge bg-primary ms-1">Bạn</span>}
              </small>
              <small className="text-muted">
                <i className="fas fa-clock me-1"></i>
                {getTimeAgo(post.createdAt)}
              </small>
            </div>
          </div>

          {post.updatedAt !== post.createdAt && (
            <small className="text-muted d-block">
              <i className="fas fa-edit me-1"></i>
              Đã chỉnh sửa {getTimeAgo(post.updatedAt)}
            </small>
          )}
        </div>
      </div>

      <div className="card-footer bg-transparent">
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/posts/${post.id}`} className="btn btn-outline-primary btn-sm" style={{ textDecoration: "none" }}>
            <i className="fas fa-eye me-1"></i>
            Xem chi tiết
          </Link>

          {(canEdit || canDelete) && (
            <div className="btn-group" role="group">
              {canEdit && (
                <Link
                  to={`/posts/${post.id}/edit`}
                  className="btn btn-outline-secondary btn-sm"
                  title="Chỉnh sửa bài viết"
                >
                  <i className="fas fa-edit"></i>
                </Link>
              )}
              {canDelete && (
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => onDelete(post.id)}
                  disabled={isDeleting}
                  title="Xóa bài viết"
                >
                  {isDeleting ? (
                    <span className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Đang xóa...</span>
                    </span>
                  ) : (
                    <i className="fas fa-trash"></i>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostCard
