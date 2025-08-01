import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewDiscountReq,
  deleteDiscountReq,
  fetchDiscountListReq,
  updateDiscountReq,
} from "../../../../api/discountApi/discount";

export const discountSlice = createSlice({
  name: "discountList",
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

export const { setLoading, addData, setError } = discountSlice.actions;
export default discountSlice.reducer;

// Action to add a new discount
export const addNewDiscount = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await addNewDiscountReq(data); // Call API to add a discount

    // Fetch updated list of discounts after adding a new one
    await dispatch(fetchDiscountList());

    // Optionally show success notification
    Swal.fire({
      text: "Discount added successfully!",
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

// Action to update a discount
export const updateDiscount = async (data, dispatch) => {
  
  try {
    debugger;
    dispatch(setLoading()); // Set loading before making the API request
    await updateDiscountReq(data); // Call API to update discount

    // Fetch updated list of discounts after updating
    await dispatch(fetchDiscountList());

    Swal.fire({
      text: "Discount updated successfully!",
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

// Action to delete a discount
export const deleteDiscount = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await deleteDiscountReq(data); // Call API to delete a discount

    // Fetch updated list of discounts after deleting
    await dispatch(fetchDiscountList());

    Swal.fire({
      text: "Discount deleted successfully!",
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

// Action to fetch the discount list
export const fetchDiscountList = () => async (dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    const res = await fetchDiscountListReq(); // Fetch discount list from API
    dispatch(addData(res.data)); // Dispatch the data to Redux state
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Failed to load discounts",
      icon: "error",
    });
  }
};
