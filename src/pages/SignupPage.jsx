import axiosInstance from "../apis/instance";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignupPage.css";

import profile1 from "../assets/images/profile/profile_1.png";
import profile2 from "../assets/images/profile/profile_2.png";
import profile3 from "../assets/images/profile/profile_3.png";
import profile4 from "../assets/images/profile/profile_4.png";
import profile5 from "../assets/images/profile/profile_5.png";
import profile6 from "../assets/images/profile/profile_6.png";

const profiles = [profile1, profile2, profile3, profile4, profile5, profile6];

export default function SignupPage() {
  const navigate = useNavigate(); // 추가
  const [form, setForm] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    profileImg: 1,
    resTime: 21,
  });

  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/;
    return regex.test(password);
  };

  const validateUserId = (userId) => {
    const regex = /^[a-zA-Z0-9]{4,20}$/;
    return regex.test(userId);
  };

  const validateNickname = (nickname) => {
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,20}$/;
    return nicknameRegex.test(nickname);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      alert("이미 로그인 한 상태입니다.");
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "resTime" ? parseInt(value, 10) : value,
    });

    if (e.target.name === "confirmPassword") {
      setPasswordMatchError(e.target.value !== form.password);
    }
    if (e.target.name === "password") {
      setPasswordMatchError(e.target.value !== value);
    }
  };

  const handleProfileChange = (e) => {
    setForm({ ...form, profileImg: parseInt(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // 초기화

    if (!validateUserId(form.userId)) {
      setErrorMessage(
        "아이디는 영문/숫자 4~20자이며 특수문자는 사용할 수 없습니다."
      );
      return;
    }

    if (!validatePassword(form.password)) {
      setErrorMessage(
        "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다."
      );
      return;
    }

    if (!validateNickname(form.nickname)) {
      setErrorMessage(
        "닉네임은 2~20자의 영문, 숫자, 한글만 사용할 수 있으며 공백과 특수문자는 사용할 수 없습니다."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setPasswordMatchError(true);
      alert("비밀번호가 일치하지 않습니다. 확인해주세요.");
      return;
    }

    try {
      await axiosInstance.post("/signup", form);
      alert("회원가입 성공");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data;
      setErrorMessage(msg || "회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>회원가입</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="userId">아이디</label>
          <input
            name="userId"
            placeholder="아이디"
            onChange={handleChange}
            required
          />
          <label htmlFor="password">비밀번호</label>
          <input
            name="password"
            placeholder="비밀번호"
            type="password"
            onChange={handleChange}
            required
          />
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            name="confirmPassword"
            placeholder="비밀번호 확인"
            type="password"
            onChange={handleChange}
            required
          />
          {passwordMatchError && (
            <span className="error-message">비밀번호가 일치하지 않습니다.</span>
          )}
          <label htmlFor="nickname">닉네임</label>
          <input
            name="nickname"
            placeholder="닉네임"
            onChange={handleChange}
            required
          />
          <div className="profile-selection">
            <p>프로필 이미지 선택</p>
            <div style={{ display: "flex", gap: "10px" }}>
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const profileImage = profiles[num - 1];
                return (
                  <label key={num}>
                    <input
                      type="radio"
                      name="profileImg"
                      placeholder="프로필사진"
                      value={num}
                      checked={form.profileImg === num}
                      onChange={handleProfileChange}
                    />
                    <img
                      src={profileImage}
                      alt={`프로필 ${num}번`}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                  </label>
                );
              })}
            </div>
          </div>
          <label htmlFor="resTime">요약 예약 시간</label>
          <input
            name="resTime"
            type="number"
            placeholder="요약 예약 시간"
            onChange={handleChange}
            min={1}
            max={24}
            required
          />

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <button type="submit">회원가입</button>
        </form>
        <div className="login-link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
}
