import { authAxios, publicAxios } from "../config";
import { ApiKey } from "../endpoints";

export const userLoginReq = async ({ userName, password }) => {
  try {
   
    const body = {
      username: userName,
      password: password,
    };
    const res = await publicAxios.post(`${ApiKey.loginKey}`, body);
    const _data = {
      token: res?.data?.token || "",
      expiresAt: res?.data?.expiresAt || "",
      roleId: res?.data?.roleId || "",
      roleName: res?.data?.roleName || "",
      username: res?.data?.username || "",
      userId: res?.data?.userId || 0,
    };

    localStorage.setItem("token", _data?.token);
    localStorage.setItem("tokenExpire", _data?.expiresAt);
    localStorage.setItem("roleName", _data?.roleName);
    localStorage.setItem("username", _data?.username);
    localStorage.setItem("userid", _data?.userId);
    localStorage.setItem("roleid", _data?.roleId);


    return { error: false, data: _data, message: "", errorMsg: "" };
  } catch (err) {
    let error;
    if (err.response) error = err.response.data.message || "Response error";
    else if (err.request) error = "Request error";
    else error = "Something went wrong please try again later";
    throw { error: true, data: "", message: "", errorMsg: error };
  }
};
