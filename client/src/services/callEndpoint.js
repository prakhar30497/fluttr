import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

export async function callEndpoint(url, options) {
  try {
    const res = await api(url, options);
    return res.data;
  } catch (error) {
    return await Promise.reject(error?.response?.data?.message ?? "Error");
  }
}
