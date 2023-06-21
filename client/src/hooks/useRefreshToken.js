import { api } from "../services/axios";
import { useAuth } from "./AuthContext";

const useRefreshToken = () => {
  const { setAuthState } = useAuth();

  const refresh = async () => {
    const response = await api.get("/refresh-token", {
      withCredentials: true,
    });
    setAuthState((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
