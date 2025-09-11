"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { deleteUser, fetchUsers, updateUserRole } from "../store/slices/userSlice"
import { addToast } from "../store/slices/toastSlice"

const UserManagement: React.FC = () => {
  const dispatch = useDispatch()
  const { users, loading, error } = useSelector((state: RootState) => state.users)
  const { user: currentUser } = useSelector((state: RootState) => state.auth)

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [isUpdatingRole, setIsUpdatingRole] = useState<number | null>(null)

  useEffect(() => {
    dispatch(fetchUsers() as any)
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

  const handleDeleteUser = async (id: number, username: string) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${username}" không?`)
    if (confirmed) {
      setIsDeleting(id)
      try {
        await dispatch(deleteUser(id) as any).unwrap()
        dispatch(
          addToast({
            message: `Đã xóa người dùng "${username}" thành công`,
            type: "success",
          }),
        )
      } catch (error: any) {
        dispatch(
          addToast({
            message: error.message || "Có lỗi xảy ra khi xóa người dùng",
            type: "error",
          }),
        )
      } finally {
        setIsDeleting(null)
      }
    }
  }

  const handleRoleChange = async (id: number, newRole: string, username: string) => {
    const roleText = newRole === "ROLE_ADMIN" ? "Quản trị viên" : "Người dùng"
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn thay đổi vai trò của "${username}" thành ${roleText} không?`,
    )
    if (confirmed) {
      setIsUpdatingRole(id)
      try {
        await dispatch(updateUserRole({ id, role: newRole }) as any).unwrap()
        dispatch(
          addToast({
            message: `Đã cập nhật vai trò của "${username}" thành ${roleText}`,
            type: "success",
          }),
        )
      } catch (error: any) {
        dispatch(
          addToast({
            message: error.message || "Có lỗi xảy ra khi cập nhật vai trò",
            type: "error",
          }),
        )
      } finally {
        setIsUpdatingRole(null)
      }
    }
  }

  const filteredUsers = Array.isArray(users) ? users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "" || user.role === roleFilter

    return matchesSearch && matchesRole
  }) : [];

  if (loading && users.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3 text-muted">Đang tải danh sách người dùng...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">
          <i className="fas fa-users me-2"></i>
          Quản Lý Người Dùng
        </h1>
        <div className="d-flex align-items-center gap-3">
          <div className="badge bg-primary fs-6">{filteredUsers.length} người dùng</div>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => dispatch(fetchUsers() as any)}
            disabled={loading}
          >
            <i className="fas fa-sync-alt me-1"></i>
            Làm mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <label htmlFor="search" className="form-label">
                <i className="fas fa-search me-1"></i>
                Tìm kiếm người dùng:
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="Tìm theo tên đăng nhập, email hoặc họ tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="btn btn-outline-secondary" type="button" onClick={() => setSearchTerm("")}>
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <label htmlFor="roleFilter" className="form-label">
                <i className="fas fa-user-tag me-1"></i>
                Lọc theo vai trò:
              </label>
              <select
                className="form-select"
                id="roleFilter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">Tất cả vai trò</option>
                <option value="ROLE_USER">Người dùng</option>
                <option value="ROLE_ADMIN">Quản trị viên</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-users fa-4x text-muted mb-4"></i>
          <h3 className="text-muted mb-3">Không tìm thấy người dùng nào</h3>
          <p className="text-muted">
            {searchTerm || roleFilter
              ? "Không có người dùng nào phù hợp với bộ lọc hiện tại."
              : "Chưa có người dùng nào trong hệ thống."}
          </p>
          {(searchTerm || roleFilter) && (
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setSearchTerm("")
                setRoleFilter("")
              }}
            >
              <i className="fas fa-times me-2"></i>
              Xóa bộ lọc
            </button>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Người dùng</th>
                  <th>Email</th>
                  <th>Giới tính</th>
                  <th>Vai trò</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={isDeleting === user.id ? "opacity-50" : ""}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <i className="fas fa-user text-white"></i>
                        </div>
                        <div>
                          <div className="fw-bold">
                            {user.firstName} {user.lastName}
                            {user.id === currentUser?.id && <span className="badge bg-success ms-2">Bạn</span>}
                          </div>
                          <small className="text-muted">@{user.username}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-break">{user.email}</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">
                        {user.gender === "M" ? "Nam" : user.gender === "F" ? "Nữ" : "Khác"}
                      </span>
                    </td>
                    <td>
                      <select
                        className={`form-select form-select-sm ${
                          user.role === "ROLE_ADMIN" ? "bg-danger text-white" : "bg-primary text-white"
                        }`}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value, user.username)}
                        disabled={user.id === currentUser?.id || isUpdatingRole === user.id}
                        title={
                          user.id === currentUser?.id ? "Không thể thay đổi vai trò của chính mình" : "Thay đổi vai trò"
                        }
                      >
                        <option value="ROLE_USER">Người dùng</option>
                        <option value="ROLE_ADMIN">Quản trị viên</option>
                      </select>
                      {isUpdatingRole === user.id && (
                        <div className="spinner-border spinner-border-sm mt-1" role="status">
                          <span className="visually-hidden">Đang cập nhật...</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        disabled={user.id === currentUser?.id || isDeleting === user.id}
                        title={
                          user.id === currentUser?.id ? "Không thể xóa tài khoản của chính mình" : "Xóa người dùng"
                        }
                      >
                        {isDeleting === user.id ? (
                          <span className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Đang xóa...</span>
                          </span>
                        ) : (
                          <i className="fas fa-trash"></i>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-footer bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Hiển thị {filteredUsers.length} / {users.length} người dùng
              </small>
              <small className="text-muted">
                Quản trị viên: {users.filter((u) => u.role === "ROLE_ADMIN").length} | Người dùng:{" "}
                {users.filter((u) => u.role === "ROLE_USER").length}
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
