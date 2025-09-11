"use client"

import type React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate, Link } from "react-router-dom"
import type { RootState } from "../../store/store"
import { fetchPostById, deletePost, clearCurrentPost } from "../../store/slices/postSlice"

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { currentPost, loading, error } = useSelector((state: RootState) => state.posts)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(Number.parseInt(id)) as any)
    }

    return () => {
      dispatch(clearCurrentPost())
    }
  }, [dispatch, id])

  const handleDelete = async () => {
    if (!currentPost || !window.confirm("Are you sure you want to delete this post?")) {
      return
    }

    try {
      await dispatch(deletePost(currentPost.id) as any).unwrap()
      navigate("/posts")
    } catch (error) {
      console.error("Failed to delete post:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error || !currentPost) {
    return (
      <div className="error-message">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error || "Post not found"}
      </div>
    )
  }

  const isOwner = user?.id === currentPost.author.id
  const isAdmin = user?.role === "ADMIN"
  const canEdit = isOwner || isAdmin
  const canDelete = isOwner || isAdmin

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow">
          {/* Post Image */}
          <img
            src="/detailed-blog-post-header-image.jpg"
            className="card-img-top"
            alt="Post header"
            style={{ height: "300px", objectFit: "cover" }}
          />

          <div className="card-body">
            {/* Post Header */}
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h1 className="card-title">{currentPost.title}</h1>
                <div className="text-muted">
                  <i className="fas fa-user me-1"></i>
                  By {currentPost.author.firstName} {currentPost.author.lastName}
                  <span className="mx-2">•</span>
                  <i className="fas fa-calendar me-1"></i>
                  {formatDate(currentPost.createdAt)}
                  {currentPost.updatedAt !== currentPost.createdAt && (
                    <>
                      <span className="mx-2">•</span>
                      <i className="fas fa-edit me-1"></i>
                      Updated {formatDate(currentPost.updatedAt)}
                    </>
                  )}
                </div>
              </div>

              {(canEdit || canDelete) && (
                <div className="btn-group" role="group">
                  {canEdit && (
                    <Link to={`/posts/${currentPost.id}/edit`} className="btn btn-outline-primary">
                      <i className="fas fa-edit me-1"></i>
                      Edit
                    </Link>
                  )}
                  {canDelete && (
                    <button className="btn btn-outline-danger" onClick={handleDelete}>
                      <i className="fas fa-trash me-1"></i>
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>

            <hr />

            {/* Post Content */}
            <div className="post-content">
              <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{currentPost.content}</p>
            </div>
          </div>

          <div className="card-footer bg-transparent">
            <Link to="/posts" className="btn btn-secondary">
              <i className="fas fa-arrow-left me-2"></i>
              Back to Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
