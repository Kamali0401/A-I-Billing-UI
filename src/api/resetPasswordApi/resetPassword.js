// src/api/authApi/auth.js
import { publicAxios } from "../config";
import { ApiKey } from "../endpoints";

export const resetPasswordReq = async (username, password) => {
  try {
    const res = await publicAxios.put(`authentication/reset-password`, null, {
      params: { username, password }
    });

    const msg = res.data?.message || "Password reset successful";
    return { error: false, data: res.data, message: msg, errorMsg: "" };
  } catch (err) {
    console.error("Reset Password API Error:", err);
    const error =
      err.response?.data?.message || err.message || "Something went wrong";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
