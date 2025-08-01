import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: false,
    data: null,
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    addData: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data = payload;
      return state;
    },
    clearData: (state) => {
      state.loading = false;
      state.error = false;
      state.data = null;
      return state;
    },
    setError: (state) => {
      state.error = true;
      return state;
    },
  },
});

export const { setLoading, addData, clearData, setError } = authSlice.actions;
export default authSlice.reducer;

export const addUserAction = async (data, dispatch) => {
  try {
    dispatch(addData(data));
  } catch (error) {
    throw { errorMsg: error };
  }
};

export const clearUserAction = async (dispatch) => {
  try {
    dispatch(clearData());
  } catch (error) {
    throw { errorMsg: error };
  }
};
