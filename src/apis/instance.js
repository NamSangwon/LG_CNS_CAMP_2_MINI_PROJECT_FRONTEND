import axios from "axios";
import { getLoggedInUserId } from "../utils/checkUser.js";
import { EXCLUDED_ROUTES } from "../constants/excludedUrls";

// URL이 제외 대상인지 체크
function isExcludedRoute(method, url) {
  return EXCLUDED_ROUTES.some((route) => {
    return (
      route.method === method && url.startsWith(route.path) // 상세 조회도 포함되게
    );
  });
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const method = config.method?.toUpperCase();
    const url = config.url ?? "";

    if (isExcludedRoute(method, url)) {
      delete config.headers.Authorization;
      console.log(`🔓 [PUBLIC] ${url} → 토큰 없이 요청`);
      return config;
    }

    const userId = getLoggedInUserId();

    if (!userId) {
      console.warn(`❌ [UNAUTHORIZED] ${url} → 유효하지 않은 토큰`);
      confirm("로그인 정보가 만료되었습니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/login"; // 로그인 페이지로 리다이렉트
      return Promise.reject(
        new axios.Cancel("요청 취소됨: 유효하지 않은 토큰") // 요청 취소
      );
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
