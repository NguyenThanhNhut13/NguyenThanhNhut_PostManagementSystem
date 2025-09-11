import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postAPI } from "../../servies/api";

export interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

const initialState: PostState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (
    params: {
      page?: number;
      size?: number;
      sortBy?: string;
      direction?: string;
      myPosts?: boolean;
    } = {}
  ) => {
    const response = await postAPI.getAllPosts(params);
    const result = response.data as {
      success: boolean;
      message: string;
      data:
        | Post[]
        | {
            content: Post[];
            number: number;
            size: number;
            totalElements: number;
            totalPages: number;
          };
    };
    return result.data;
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id: number) => {
    const response = await postAPI.getPostById(id);
    const result = response.data as {
      success: boolean;
      message: string;
      data: Post;
    };
    return result.data;
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData: { title: string; content: string }) => {
    const response = await postAPI.createPost(postData);
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({
    id,
    postData,
  }: {
    id: number;
    postData: { title: string; content: string };
  }) => {
    const response = await postAPI.updatePost(id, postData);
    console.log("updatePost response:", response);
    const result = response.data as {
      success: boolean;
      message: string;
      data: Post;
    };
    return result.data;
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id: number) => {
    const response = await postAPI.deletePost(id);
    console.log("deletePost response:", response);
    // Just return the ID since we need it to filter out the deleted post
    return id;
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        state.posts = payload.posts;
        state.pagination = {
          currentPage: payload.currentPage ?? 0,
          size: state.pagination.size,
          totalElements: payload.totalElements ?? 0,
          totalPages: payload.totalPages ?? 1,
        };
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch posts";
      })
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload as Post;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch post";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload as Post);
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        console.log("updatePost.fulfilled payload:", action.payload);
        const updatedPost = action.payload as Post;
        
        // Update in posts list if present
        const index = state.posts.findIndex(
          (post) => post.id === updatedPost.id
        );
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
        
        // Update current post
        state.currentPost = updatedPost;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update post";
      })
      .addCase(deletePost.pending, (state) => {
        // We don't set loading=true here to avoid showing the loading spinner for the whole list
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        // Update the totalElements count after deleting a post
        state.pagination = {
          ...state.pagination,
          totalElements: state.pagination.totalElements - 1
        };
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete post";
      });
  },
});

export const { clearCurrentPost, clearError } = postSlice.actions;
export default postSlice.reducer;
