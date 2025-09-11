import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { userAPI } from "../../services/api"

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  role: string
}

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
}

export const fetchUsers = createAsyncThunk<User[]>("users/fetchUsers", async () => {
  const response = await userAPI.getAllUsers();
  const result = response.data as {
    success: boolean;
    message: string;
    data: User[];
  };
  return result.data;
})

export const deleteUser = createAsyncThunk("users/deleteUser", async (id: number) => {
  await userAPI.deleteUser(id)
  return id
})

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch users"
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload)
      })
  },
})

export const { clearError } = userSlice.actions
export default userSlice.reducer
