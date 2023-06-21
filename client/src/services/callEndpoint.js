import { api } from "./axios";

export async function callEndpoint(url, options) {
  try {
    const res = await api(url, options);
    return res.data;
  } catch (error) {
    return await Promise.reject(error?.response?.data?.message ?? "Error");
  }
}

export async function callPrivateEndpoint(axiosPrivate, url, options) {
  try {
    const res = await axiosPrivate(url, options);
    return res.data;
  } catch (error) {
    return await Promise.reject(error?.response?.data?.message ?? "Auth Error");
  }
}
