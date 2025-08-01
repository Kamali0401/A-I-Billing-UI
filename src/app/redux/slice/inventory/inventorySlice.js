import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewInventoryReq,
  deleteInventoryReq,
  fetchInventoryListReq,
  updateInventoryReq,
} from "../../../../api/inventoryApi/inventoryReq";

export const inventorySlice = createSlice({
  name: "inventoryList",
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

export const { setLoading, addData, setError } = inventorySlice.actions;
export default inventorySlice.reducer;

// Action to add a new inventory
export const addNewInventory = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await addNewInventoryReq(data); // Call API to add a inventory

    // Fetch updated list of inventorys after adding a new one
    await dispatch(fetchInventoryList());

    // Optionally show success notification
    Swal.fire({
      text: "Inventory added successfully!",
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

// Action to update a inventory
export const updateInventory = async (data, dispatch) => {
  try {
    debugger;
    dispatch(setLoading()); // Set loading before making the API request
    await updateInventoryReq(data); // Call API to update inventory

    // Fetch updated list of inventorys after updating
    await dispatch(fetchInventoryList());

    Swal.fire({
      text: "Inventory updated successfully!",
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

// Action to delete a inventory
export const deleteInventory = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await deleteInventoryReq(data); // Call API to delete a inventory

    // Fetch updated list of inventorys after deleting
    await dispatch(fetchInventoryList());

    Swal.fire({
      text: "Inventory deleted successfully!",
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

// Action to fetch the inventory list
export const fetchInventoryList = () => async (dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    const res = await fetchInventoryListReq(); // Fetch inventory list from API
    dispatch(addData(res.data)); // Dispatch the data to Redux state
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Failed to load inventorys",
      icon: "error",
    });
  }
};
