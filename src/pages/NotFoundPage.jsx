import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>404</h1>
      <p>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
      <button
        onClick={() => navigate("/")}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        홈으로 이동
      </button>
    </div>
  );
}
