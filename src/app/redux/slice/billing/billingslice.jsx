import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
    fetchOrderDetailsReq
} from "../../../../api/billlingApi/billing";

export const billingSlice = createSlice({
  name: "BillingList",
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

export const { setLoading, addData, setError } = billingSlice.actions;
export default billingSlice.reducer;


// Action to fetch the discount list
export const fetchOrderDetailsList = (orderId) => async (dispatch) => {
    try {
      debugger;
      dispatch(setLoading()); // Set loading state
      const res = await fetchOrderDetailsReq(orderId); // Pass orderId to the API function
      dispatch(addData(res.data)); // Update Redux state with fetched data
      return res.data; 
    } catch (error) {
      dispatch(setError()); // Handle errors
      Swal.fire({
        text: "Failed to load order details",
        icon: "error",
      });
    }
  };
