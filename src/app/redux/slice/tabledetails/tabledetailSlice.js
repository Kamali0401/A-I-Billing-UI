import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewTableDetailsReq,
  deleteTableDetailsReq,
  fetchTableDetailsListReq,
  updateTableDetailsReq,
} from "../../../../api/tableDetailsApi/tabledetails";

export const TableDetailsSlice = createSlice({
  name: "TableDetailsList",
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

export const { setLoading, addData, setError } = TableDetailsSlice.actions;
export default TableDetailsSlice.reducer;

// Action to add a new TableDetails
export const addNewTableDetails = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await addNewTableDetailsReq(data); // Call API to add a TableDetails
    await dispatch(fetchTableDetailsList()); // Fetch updated list of TableDetailss
  
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
          text: "TableDetails added successfully!",
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

// Action to update a TableDetails
export const updateTableDetails = async (data, dispatch) => {
  try {
    debugger;
    dispatch(setLoading()); // Set loading before making the API request
    await updateTableDetailsReq(data); // Call API to update TableDetails
    await dispatch(fetchTableDetailsList()); // Fetch updated list of TableDetailss
   Swal.fire({
        text: "TableDetails updated successfully!",
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
  

// Action to delete a TableDetails
export const deleteTableDetails = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await deleteTableDetailsReq(data); // Call API to delete a TableDetails
    await dispatch(fetchTableDetailsList()); // Fetch updated list of TableDetailss
 Swal.fire({
       text: "TableDetails deleted successfully!",
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
// Action to fetch the TableDetails list
export const fetchTableDetailsList = () => async (dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    const res = await fetchTableDetailsListReq(); // Fetch TableDetails list from API
    dispatch(addData(res.data)); // Dispatch the data to Redux state
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Failed to load TableDetails",
      icon: "error",
    });
  }
};
