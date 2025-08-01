import { authAxios, publicAxios } from "../config";
import { ApiKey } from "../endpoints";

export const fetchInventoryCostReq = async () => {
  try {
    debugger;
    const res = await publicAxios.get(`${ApiKey.InventoryCost}`);

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
export const fetchInventoryCostListReq = async () => {
    try {
      debugger;
      const res = await publicAxios.get(`${ApiKey.InventoryCost}`);
     // console.log("API Response:", res);
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
export const addNewInventoryCostReq = async (data) => {
  try {
    debugger;
    const res = await publicAxios.post(`${ApiKey.InventoryCost}`, data);
//console.log("API Response:", res);               // Full Axios response
//console.log("Inventory Costs:", res.data); 
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
export const updateInventoryCostReq = async (data) => {
  try {
    debugger;
    const res = await publicAxios.put(`${ApiKey.InventoryCost}`, data);

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

export const deleteInventoryCostReq = async (actionId) => {
  try {
    const res = await publicAxios.delete(`${ApiKey.InventoryCost}/${actionId}`);

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
