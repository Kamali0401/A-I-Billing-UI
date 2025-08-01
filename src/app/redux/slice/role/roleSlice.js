import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {
  addNewRoleReq,
  deleteRoleReq,
  fetchRoleListReq,
  updateRoleReq,
} from "../../../../api/roleApi/role";

export const roleSlice = createSlice({
  name: "roleList",
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

export const { setLoading, addData, setError } = roleSlice.actions;
export default roleSlice.reducer;

// Action to add a new role
export const addNewRole = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await addNewRoleReq(data); // Call API to add a role
    await dispatch(fetchRoleList()); // Fetch updated list of roles
  
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
          text: "Role added successfully!",
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

// Action to update a role
export const updateRole = async (data, dispatch) => {
  try {
    debugger;
    dispatch(setLoading()); // Set loading before making the API request
    await updateRoleReq(data); // Call API to update role
    await dispatch(fetchRoleList()); // Fetch updated list of roles
   Swal.fire({
        text: "Role updated successfully!",
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
  

// Action to delete a role
export const deleteRole = async (data, dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    await deleteRoleReq(data); // Call API to delete a role
    await dispatch(fetchRoleList()); // Fetch updated list of roles
 Swal.fire({
       text: "Role deleted successfully!",
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
// Action to fetch the role list
export const fetchRoleList = () => async (dispatch) => {
  try {
    dispatch(setLoading()); // Set loading before making the API request
    const res = await fetchRoleListReq(); // Fetch role list from API
    dispatch(addData(res.data)); // Dispatch the data to Redux state
  } catch (error) {
    dispatch(setError()); // Handle error if API fails
    Swal.fire({
      text: "Failed to load roles",
      icon: "error",
    });
  }
};
