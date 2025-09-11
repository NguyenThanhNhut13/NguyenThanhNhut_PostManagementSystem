import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../servies/api";

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  { user: User; token: string },
  { username: string; password: string },
  { rejectValue: { code: string; message: string } }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authAPI.login(credentials);
    const data = response.data as { user: User; data: { jwt: string } };
    return {
      user: data.user,
      token: data.data.jwt,
    };
  } catch (err: any) {
    if (err.response && err.response.data) {
      return rejectWithValue(err.response.data);
    }
    return rejectWithValue({ code: "UNKNOWN", message: "Đăng nhập thất bại!" });
  }
});

export const register = createAsyncThunk<
  { user: User },
  {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
  },
  { rejectValue: { code: string; message: string } }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await authAPI.register(userData);
    return response.data as { user: User };
  } catch (err: any) {
    if (err.response && err.response.data) {
      return rejectWithValue(err.response.data);
    }
    return rejectWithValue({ code: "UNKNOWN", message: "Đăng ký thất bại!" });
  }
});

export const checkAuthStatus = createAsyncThunk<{ token: string }, void>(
  "auth/checkStatus",
  async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    // In a real app, you'd validate the token with the server
    // For now, we'll assume the token is valid if it exists
    return { token } as { token: string };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message || "Login failed";
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message || "Đăng ký thất bại!";
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.token = null;
        localStorage.removeItem("token");
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
