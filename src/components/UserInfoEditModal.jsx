import { useEffect, useState } from "react";
import "./userInfoEditModal.css";
import { updateUserInfo } from "../apis/userApi";

import profile1 from "../assets/images/profile/profile_1.png";
import profile2 from "../assets/images/profile/profile_2.png";
import profile3 from "../assets/images/profile/profile_3.png";
import profile4 from "../assets/images/profile/profile_4.png";
import profile5 from "../assets/images/profile/profile_5.png";
import profile6 from "../assets/images/profile/profile_6.png";

const profiles = [profile1, profile2, profile3, profile4, profile5, profile6];

export default function UserInfoEditModal({ initialUser, onClose, onSave }) {
  const [avatar, setAvatar] = useState(initialUser.profile_img);
  const [nickname, setNickname] = useState(initialUser.nickname);
  const [summaryTime, setSummaryTime] = useState(
    initialUser.res_time || ""
  );

  const handleSave = async () => {
    try {
      const updatedUser = {
        profile_img: avatar,
        nickname,
        res_time: parseInt(summaryTime, 10),
      };

      await updateUserInfo(updatedUser);
      onSave(updatedUser);
      onClose();
    } catch (error) {
      console.error("업데이트 실패:", error);
      alert("정보 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="modal_overlay" onClick={onClose}>
      <div className="modal_box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal_title">정보수정</h2>

        <div className="field">
          <div className="field_label">프로필</div>
          <div className="avatar_grid">
            {profiles.map((src, idx) => (
              <button
                key={idx}
                type="button"
                className={
                  avatar === idx + 1 ? "avatar_item selected" : "avatar_item"
                }
                onClick={() => setAvatar(idx + 1)}
              >
                <img src={src} alt={`프로필 ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="field_label">닉네임</div>
          <input
            className="field_input"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요."
          />
        </div>

        <div className="field">
          <div className="field_label with_icon">요약시간 선택</div>
          <select
            className="field_input"
            value={summaryTime}
            onChange={(e) => setSummaryTime(e.target.value)}
          >
            <option value="">요약 시간선택</option>
            {Array.from({ length: 24 }, (_, i) => {
              const value = i.toString().padStart(2, "0");
              return (
                <option key={value} value={value}>
                  {`${value}시`}
                </option>
              );
            })}
          </select>
        </div>

        <button className="modal_btn" type="button" onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );
}
