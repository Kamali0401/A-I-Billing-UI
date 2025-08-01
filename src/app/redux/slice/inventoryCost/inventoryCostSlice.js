import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewInventoryCostReq,
  deleteInventoryCostReq,
  fetchInventoryCostListReq,
  updateInventoryCostReq,
} from "../../../../api/inventoryCostApi/inventoryCostReq";

export const inventorycostSlice = createSlice({
  name: "inventorycostList",
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

export const { setLoading, addData, setError } = inventorycostSlice.actions;
export default inventorycostSlice.reducer;

// Action to add a new inventorycost
export const addNewInventoryCost = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await addNewInventoryCostReq(data); // Call API to add a inventorycost

    // Fetch updated list of inventorycosts after adding a new one
    await dispatch(fetchInventoryCostList());

    // Optionally show success notification
    Swal.fire({
      text: "Inventory Cost added successfully!",
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

// Action to update a inventorycost
export const updateInventoryCost = async (data, dispatch) => {
  try {
    debugger;
    dispatch(setLoading()); // Set loading before making the API request
    await updateInventoryCostReq(data); // Call API to update inventorycost

    // Fetch updated list of inventorycosts after updating
    await dispatch(fetchInventoryCostList());

    Swal.fire({
      text: "Inventory Cost updated successfully!",
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

// Action to delete a inventorycost
export const deleteInventoryCost = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await deleteInventoryCostReq(data); // Call API to delete a inventorycost

    // Fetch updated list of inventorycosts after deleting
    await dispatch(fetchInventoryCostList());

    Swal.fire({
      text: "Inventory Cost deleted successfully!",
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

// Action to fetch the inventorycost list
export const fetchInventoryCostList = () => async (dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    const res = await fetchInventoryCostListReq(); // Fetch inventorycost list from API
    dispatch(addData(res.data)); // Dispatch the data to Redux state
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Failed to load inventorycosts",
      icon: "error",
    });
  }
};
