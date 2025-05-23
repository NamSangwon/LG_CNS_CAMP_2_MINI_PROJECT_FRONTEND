import axios from "axios";
import { getLoggedInUserId } from "../utils/checkUser.js";
import { EXCLUDED_URLS } from "../constants/excludedUrls";

// URL이 제외 대상인지 체크
function isExcludedUrl(requestUrl) {
  if (!requestUrl) return true;
  return EXCLUDED_URLS.some((urlPrefix) => requestUrl.startsWith(urlPrefix));
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const url = config.url ?? "";

    if (isExcludedUrl(url)) {
      delete config.headers.Authorization;
      console.log(`🔓 [PUBLIC] ${url} → 토큰 없이 요청`);
      return config;
    }

    const userId = getLoggedInUserId();

    if (!userId) {
      console.warn(`❌ [UNAUTHORIZED] ${url} → 유효하지 않은 토큰`);
      return config; // Authorization 없이 요청됨 (401 처리됨)
    }

    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`🔐 [AUTHORIZED] ${url} → 로그인 유저(${userId})`);

    return config;
  },
  (error) => Promise.reject(error)
);

// 2. 요청 인터셉터 (ex. 토큰 추가)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
