import axios from "axios"

const API_BASE_URL = "http://localhost:8080/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    if (!config.headers) {
      config.headers = {}
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  login: (credentials: { username: string; password: string }) => api.post("/auth/login", credentials),
  register: (userData: {
    username: string
    password: string
    firstName: string
    lastName: string
    gender: string
    email: string
  }) => api.post("/auth/register", userData),
}

export const postAPI = {
  getAllPosts: (
    params: {
      page?: number
      size?: number
      sortBy?: string
      direction?: string
      myPosts?: boolean
    } = {},
  ) => {
    const queryParams = new URLSearchParams()
    if (params.page !== undefined) queryParams.append("page", params.page.toString())
    if (params.size !== undefined) queryParams.append("size", params.size.toString())
    if (params.sortBy) queryParams.append("sortBy", params.sortBy)
    if (params.direction) queryParams.append("direction", params.direction)
    if (params.myPosts) queryParams.append("my-posts", "true")

    return api.get(`/posts?${queryParams.toString()}`)
  },
  
  getPostById: (id: number) => api.get(`/posts/${id}`),
  createPost: (postData: { title: string; content: string }) => api.post("/posts", postData),
  updatePost: (id: number, postData: { title: string; content: string }) => api.put(`/posts/${id}`, postData),
  deletePost: (id: number) => api.delete(`/posts/${id}`),
}

export const userAPI = {
  getAllUsers: () => api.get("/users"),
  getCurrentUser: () => api.get("/users/me"),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
}

export default api
