import { authAxios, publicAxios } from "../config";
import { ApiKey } from "../endpoints";

export const fetchRoleReq = async () => {
  try {
    debugger;
    const res = await publicAxios.get(`${ApiKey.Role}`);

    const _data = res.data;
    return { error: false, data: _data, message: "", errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
export const fetchRoleListReq = async () => {
    try {
      debugger;
      const res = await publicAxios.get(`${ApiKey.Role}`);
  
      const _data = res.data;
      return { error: false, data: _data, message: "", errorMsg: "" };
    } catch (err) {
      let error;
      if (err.response) error = err.response.data.message || "Response error";
      else if (err.request) error = "Request error";
      else error = "Something went wrong please try again later";
      throw { error: true, data: "", message: "", errorMsg: error };
    }
  };
export const addNewRoleReq = async (data) => {
  try {
    const res = await publicAxios.post(`${ApiKey.Role}`, data);
    const msg = res.data.message;
    const _data = res.data;
    return { error: false, data: _data, message: msg, errorMsg: "" };
  } catch (err) {
    // Log the full error object for debugging
    console.error("Full API error:", err);
    if (err.response) {
      console.error("Error response data:", err.response.data);
    }

    let error;
    if (err.response) {
      // If there is a response, try logging its full data structure:
      error = err.response.data.message || "Response error";
    } else if (err.request) {
      error = "Request error";
    } else {
      error = "Something went wrong please try again later";
    }
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};

export const updateRoleReq = async (data) => {
  try {
    const res = await publicAxios.put(`${ApiKey.Role}`, data);

    const msg = res.data.message;
    const _data = res.data;
    return { error: false, data: _data, message: msg, errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};

export const deleteRoleReq = async (actionId) => {
  try {
    const res = await publicAxios.delete(`${ApiKey.Role}/${actionId}`);

    const msg = res.data?.message;
    const _data = res.data;
    return { error: false, data: _data, message: msg, errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
