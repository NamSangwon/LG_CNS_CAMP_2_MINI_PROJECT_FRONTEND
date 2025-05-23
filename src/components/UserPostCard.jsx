import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./userPostCard.css";
import heartIcon from "../assets/icons/heart.png";
import likedHeartIcon from "../assets/icons/likedheart.png";
import messageIcon from "../assets/icons/message.png";
import alertIcon from "../assets/icons/alert.png";
import { updatePostVisibility, togglePostLike, retrySummary } from "../apis/userApi";

export default function UserPostCard({ post, onLikeChange, onRetrySuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    post_id,
    title,
    content,
    created_at,
    comment_cnt,
    like_cnt,
    is_public,
    liked,
    author_name,
    author_profile_img,
    summary_id,
  } = post;

  const pathname = location.pathname;
  const isMyPage = pathname === "/mypage";
  const showAuthor = !isMyPage || !!author_name;
  const canToggle = isMyPage && !author_name;

  const [publicState, setPublicState] = useState(is_public);
  const [likedState, setLikedState] = useState(showAuthor ? true : liked);
  const [likeCount, setLikeCount] = useState(like_cnt);
  const [isRetrying, setIsRetrying] = useState(false);

  const isEmpty = (title == null || title.trim() === "") && (content == null || content.trim() === "");
  const formattedDate = created_at
    ? new Date(created_at).toISOString().slice(0, 10)
    : "";
  const heartImg = likedState ? likedHeartIcon : heartIcon;
  const avatarSrc = author_profile_img
    ? new URL(
        `../assets/images/profile/profile_${author_profile_img}.png`,
        import.meta.url
      ).href
    : "";

  const handleToggle = async () => {
    const next = !publicState;
    setPublicState(next);
    try {
      await updatePostVisibility(post_id, next);
    } catch (error) {
      console.error("공개 여부 변경 실패:", error);
      setPublicState(!next);
    }
  };

  const handleLike = async () => {
    const next = !likedState;
    setLikedState(next);
    setLikeCount((prev) => prev + (next ? 1 : -1));
    try {
      await togglePostLike(post_id, next);
      if (onLikeChange) onLikeChange();
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      setLikedState(!next);
      setLikeCount((prev) => prev - (next ? 1 : -1));
    }
  };

  const handleCardClick = () => {
    navigate(`/post/${post_id}`);
  };

  const handleRetry = async () => {
  setIsRetrying(true);
  try {
    await retrySummary(summary_id);
  } catch (error) {
    // 에러는 무시하고 리로딩
  } finally {
    setIsRetrying(false);
    onRetrySuccess?.(); // 무조건 호출
  }
};

  if (isEmpty) {
    return isRetrying ? (
      <div className="loading_card">
        <div className="loading_state">
          <span className="loading_icon">⟳</span>
          <span className="loading_text">요약보고서 생성중...</span>
        </div>
      </div>
    ) : (
      <div className="error_card">
        <span className="error_message">
          <img src={alertIcon} alt="alert" className="error_icon" />
          {formattedDate} 요약 생성 중 오류가 발생했어요. 재시도 버튼을 눌러
          요약을 다시 요청해주세요.
        </span>
        <button
          className="retry_button"
          onClick={(e) => {
            handleRetry();
          }}
        >
          재시도
        </button>
      </div>
    );
  }

  return (
    <div className="userpost_card" onClick={handleCardClick}>
      <div className="userpost_card_header">
        {showAuthor ? (
          <span className="userpost_card_date with_profile">
            <img src={avatarSrc} alt="profile" className="profile_img" />
            <span>
              Posted by <span className="post_nickname">{author_name}</span> ·{" "}
              {formattedDate}
            </span>
          </span>
        ) : (
          <span className="userpost_card_date">{formattedDate}</span>
        )}
        <h3 className="userpost_card_title">{title}</h3>
      </div>
      <div className="userpost_card_content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      <div className="userpost_card_footer">
        <div className="userpost_card_stats">
          <span
            className="icon_text"
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            style={{ cursor: "pointer" }}
          >
            <img src={heartImg} alt="heart" className="icon" />
            {likeCount.toLocaleString()}
          </span>
          <span className="icon_text">
            <img src={messageIcon} alt="comment" className="icon" />
            {comment_cnt}
          </span>
        </div>
        {canToggle && (
          <div
            className="userpost_card_toggle"
            onClick={(e) => e.stopPropagation()}
          >
            <label className="switch">
              <input
                type="checkbox"
                checked={publicState}
                onChange={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
              />
              <span className="slider round"></span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
