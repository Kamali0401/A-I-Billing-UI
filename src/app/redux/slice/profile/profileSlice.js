import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  
  fetchProfileListReq,
  updateProfileReq,
} from "../../../../api/profileApi/profile";

export const profileSlice = createSlice({
  name: "profileList",
  initialState: {
    loading: false,
    error: false,
    data: [],
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    addData: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      state.data = payload;
    },
    setError: (state) => {
      state.error = true;
      state.loading = false;
    },
  },
});

export const { setLoading, addData, setError } = profileSlice.actions;
export default profileSlice.reducer;



// Action to update a profile
export const updateProfile = (data) => async (dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    const response = await updateProfileReq(data); // Call API to update profile

    if (!response.error) {
      await dispatch(fetchProfileList()); // Fetch updated list of profiles after updating
      Swal.fire({
        text: "Profile updated successfully!",
        icon: "success",
      });
    } else {
      throw new Error(response.errorMsg); // Handle error if API fails
    }
  } catch (error) {
    dispatch(setError()); // Handle error in Redux state
    Swal.fire({
      text: error.message || "Error! Try Again!",
      icon: "error",
    });
  }
};


// Action to fetch the profile list
export const fetchProfileList = () => async (dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    const res = await fetchProfileListReq(); // Fetch profile list from API
    dispatch(addData(res.data)); // Dispatch the data to Redux state
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Failed to load profiles",
      icon: "error",
    });
  }
};
