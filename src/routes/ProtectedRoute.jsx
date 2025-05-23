import { Navigate, useLocation } from "react-router-dom";
import { getLoggedInUserId } from "../utils/checkUser";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const userId = getLoggedInUserId();
  console.log(`🔐 [AUTHORIZED] 로그인이 필요한 유저 접근 `);
  if (!userId) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
