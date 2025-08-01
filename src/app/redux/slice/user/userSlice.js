import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewUserReq,
  deleteUserReq,
  fetchUserListReq,
  updateUserReq,
} from "../../../../api/userApi/user";

export const userSlice = createSlice({
  name: "userList",
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

export const { setLoading, addData, setError } = userSlice.actions;
export default userSlice.reducer;

// Action to add a new user
export const addNewUser = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await addNewUserReq(data); // Call API to add a user

    // Fetch updated list of users after adding a new one
    await dispatch(fetchUserList());

    // Optionally show success notification
    Swal.fire({
      text: "User added successfully!",
      icon: "success",
    });
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Error! Try Again!",
      icon: "error",
    });
    throw error; // Throw the error to be handled elsewhere
  }
};

// Action to update a user
export const updateUser = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await updateUserReq(data); // Call API to update user

    // Fetch updated list of users after updating
    await dispatch(fetchUserList());

    Swal.fire({
      text: "User updated successfully!",
      icon: "success",
    });
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Error! Try Again!",
      icon: "error",
    });
    throw error; // Handle or throw the error to be handled elsewhere
  }
};

// Action to delete a user
export const deleteUser = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await deleteUserReq(data); // Call API to delete a user

    // Fetch updated list of users after deleting
    await dispatch(fetchUserList());

    Swal.fire({
      text: "User deleted successfully!",
      icon: "success",
    });
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Error! Try Again!",
      icon: "error",
    });
    throw error; // Handle or throw the error to be handled elsewhere
  }
};

// Action to fetch the user list
export const fetchUserList = () => async (dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    const res = await fetchUserListReq(); // Fetch user list from API
    dispatch(addData(res.data)); // Dispatch the data to Redux state
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Failed to load users",
      icon: "error",
    });
  }
};
