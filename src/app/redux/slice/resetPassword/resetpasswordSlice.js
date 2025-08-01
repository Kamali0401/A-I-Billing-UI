// store/resetPasswordSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resetPasswordReq } from "../../../../api/resetPasswordApi/resetPassword";

export const resetPassword = createAsyncThunk(
  "resetPassword/reset",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await resetPasswordReq(username, password);
      return response.message;
    } catch (err) {
      return rejectWithValue(err.errorMsg || "Failed to reset password");
    }
  }
);

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState: {
    loading: false,
    message: "",
    error: "",
  },
  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.message = "";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.message = "";
        state.error = "";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = "";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.message = "";
        state.error = action.payload;
      });
  },
});

export const { clearState } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
