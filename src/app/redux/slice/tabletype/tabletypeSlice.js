import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewTableTypeReq,
  deleteTableTypeReq,
  fetchTableTypeListReq,
  updateTableTypeReq,
} from "../../../../api/tabletypeApi/tabletype";

export const TableTypeSlice = createSlice({
  name: "TableTypeList",
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

export const { setLoading, addData, setError } = TableTypeSlice.actions;
export default TableTypeSlice.reducer;

// Action to add a new TableType
export const addNewTableType = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await addNewTableTypeReq(data); // Call API to add a TableType
    await dispatch(fetchTableTypeList()); // Fetch updated list of TableTypes
  
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
          text: "TableType added successfully!",
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

// Action to update a TableType
export const updateTableType = async (data, dispatch) => {
  try {
    debugger;
    dispatch(setLoading()); // Set loading before making the API request
    await updateTableTypeReq(data); // Call API to update TableType
    await dispatch(fetchTableTypeList()); // Fetch updated list of TableTypes
   Swal.fire({
        text: "TableType updated successfully!",
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
  

// Action to delete a TableType
export const deleteTableType = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await deleteTableTypeReq(data); // Call API to delete a TableType
    await dispatch(fetchTableTypeList()); // Fetch updated list of TableTypes
 Swal.fire({
       text: "TableType deleted successfully!",
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
// Action to fetch the TableType list
export const fetchTableTypeList = () => async (dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    const res = await fetchTableTypeListReq(); // Fetch TableType list from API
    dispatch(addData(res.data)); // Dispatch the data to Redux state
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Failed to load TableTypes",
      icon: "error",
    });
  }
};
