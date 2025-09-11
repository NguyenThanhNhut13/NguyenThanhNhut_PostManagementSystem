"use client";

import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { checkAuthStatus, fetchCurrentUser } from "./store/slices/authSlice";
import Navbar from "./components/Layout/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import CreatePost from "./components/Posts/CreatePost";
import PostDetail from "./components/Posts/PostDetail";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import ToastContainer from "./components/ToastContainer";
import PostList from "./components/Posts/PostList";
import EditPost from "./components/Posts/EditPost";
import UserManagement from "./Admin/UserManagement";
import AdminRoute from "./components/Auth/AdminRoute";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuthStatus() as any);
  }, [dispatch]);

  useEffect(() => {
    // Kiểm tra xem có token không
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchCurrentUser() as any);
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/posts" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/posts" />}
          />

          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <PostList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/posts/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/posts/:id"
            element={
              <ProtectedRoute>
                <PostDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/posts/:id/edit"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          /> 

          <Route path="/" element={<Navigate to="/posts" />} />
        </Routes>
      </div>
      <div>
        <div className="footer text-center py-3 mt-4">
          <span className="text-muted">
            © 2025 Nguyễn Thanh Nhứt - Post Management System
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
