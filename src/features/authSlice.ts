import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../redux/store';
import { IUser } from '../types/user';
import authService from '../api/auth-services';
import { createUserSchema, loginSchema } from '../types/validation';
import { z } from 'zod';

interface AuthState {
  loading: boolean;
  user: Partial<IUser>;
  error: string | undefined;
}

const initialState: AuthState = {
  loading: false,
  user: {},
  error: undefined,
};

export const userLogin = createAsyncThunk(
  'auth/login',
  async (values: z.infer<typeof loginSchema>, { rejectWithValue }) => {
    try {
      return await authService.login(values);
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export const createUser = createAsyncThunk(
  'auth/register',
  async (values: z.infer<typeof createUserSchema>, { rejectWithValue }) => {
    try {
      return await authService.register(values);
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers(builder) {
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.loading = false;
      if (!action.payload.data) {
        state.error = action.payload.message;
      } else {
        state.user = action.payload.data;
      }
    });
  },
  reducers: {
    logout: (state) => {
      state.user = {};
    },
  },
});
export const authSelector = (state: RootState) => state.login;
export const { logout } = authSlice.actions;
export default authSlice.reducer;
