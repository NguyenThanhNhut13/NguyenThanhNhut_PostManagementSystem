import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { postAPI } from "../../servies/api"

export interface Post {
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

interface PostState {
  posts: Post[]
  currentPost: Post | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    size: number
    totalElements: number
    totalPages: number
  }
}

const initialState: PostState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
}

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (
    params: {
      page?: number
      size?: number
      sortBy?: string
      direction?: string
      myPosts?: boolean
    } = {},
  ) => {
    const response = await postAPI.getAllPosts(params)
    return response.data
  },
)

export const fetchPostById = createAsyncThunk("posts/fetchPostById", async (id: number) => {
  const response = await postAPI.getPostById(id)
  return response.data
})

export const createPost = createAsyncThunk("posts/createPost", async (postData: { title: string; content: string }) => {
  const response = await postAPI.createPost(postData)
  return response.data
})

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, postData }: { id: number; postData: { title: string; content: string } }) => {
    const response = await postAPI.updatePost(id, postData)
    return response.data
  },
)

export const deletePost = createAsyncThunk("posts/deletePost", async (id: number) => {
  await postAPI.deletePost(id)
  return id
})

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload as {
          content?: Post[]
          number?: number
          size?: number
          totalElements?: number
          totalPages?: number
          length?: number
        } | Post[]
        state.posts = Array.isArray(payload) ? payload as Post[] : (payload.content ?? [])
        state.pagination = {
          page: !Array.isArray(payload) && payload.number !== undefined ? payload.number : 0,
          size: !Array.isArray(payload) && payload.size !== undefined ? payload.size : 10,
          totalElements: !Array.isArray(payload) && payload.totalElements !== undefined ? payload.totalElements : (Array.isArray(payload) ? payload.length : 0),
          totalPages: !Array.isArray(payload) && payload.totalPages !== undefined ? payload.totalPages : 1,
        }
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch posts"
      })
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false
        state.currentPost = action.payload as Post
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch post"
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload as Post)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPost = action.payload as Post
        const index = state.posts.findIndex((post) => post.id === updatedPost.id)
        if (index !== -1) {
          state.posts[index] = updatedPost
        }
        state.currentPost = updatedPost
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload)
      })
  },
})

export const { clearCurrentPost, clearError } = postSlice.actions
export default postSlice.reducer
