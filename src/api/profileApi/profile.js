import { authAxios,publicAxios } from "../config";
import { ApiKey } from "../endpoints";

// Helper function for error handling
const handleApiError = (err) => {
  let error;
  if (err.response) {
    error = err.response.data.message || "Response error";
  } else if (err.request) {
    error = "Request error";
  } else {
    error = "Something went wrong, please try again later";
  }
  return { error: true, data: "", message: "", errorMsg: error };
};

// Fetch all profiles
export const fetchProfileListReq = async () => {
  try {
    const res = await publicAxios.get(`${ApiKey.RestaurantProfile}`);
    return {
      error: false,
      data: res.data || [],
      message: "",
      errorMsg: "",
    };
  } catch (err) {
    return handleApiError(err);
  }
};

// Fetch profile by ID
export const fetchProfileByIdReq = async (userId) => {
  try {
    const res = await publicAxios.get(`${ApiKey.RestaurantProfile}/${userId}`);
    const _data = res?.data ? res.data[0] : null; // Ensures safety when accessing data
    return {
      error: false,
      data: _data,
      message: "",
      errorMsg: "",
    };
  } catch (err) {
    return handleApiError(err);
  }
};

// Update profile
export const updateProfileReq = async (data) => {
  try {
    debugger;    
    const res = await publicAxios.put(`${ApiKey.RestaurantProfile}`, data);
    const msg = res?.data?.message;
    const _data = res?.data;
    return {
      error: false,
      data: _data,
      message: msg || "Profile updated successfully",
      errorMsg: "",
    };
  } catch (err) {
    return handleApiError(err);
  }
};
