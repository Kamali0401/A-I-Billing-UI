import { publicAxios } from "../config";
import { ApiKey } from "../endpoints";

export const changePasswordReq = async ({
  username,
  oldPassword,
  newPassword,
}) => {
  try {
    const API_URL = `${ApiKey.passwordChangeKey}/change-password?username=${username}&oldPassword=${oldPassword}&newPassword=${newPassword}`;
    const res = await publicAxios.put(API_URL);
    const _msg = res?.data?.message;
    const _data = res?.data;
    return { error: false, data: _data, message: _msg, errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};

export const resetPasswordReq = async ({ username, password }) => {
  try {
    const API_URL = `${ApiKey.passwordResetKey}/reset-password?username=${username}&password=${password}`;
    const res = await publicAxios.put(API_URL);
    const _msg = res?.data?.message;
    const _data = res?.data;
    return { error: false, data: _data, message: _msg, errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};

export const forgotPasswordReq = async (emailId) => {
  try {
    const API_URL = `${ApiKey.forgotPasswordKey}${emailId}`;
    const res = await publicAxios.put(API_URL);
    const _msg = res?.data?.message;
    const _data = res?.data;
    return { error: false, data: _data, message: _msg, errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
