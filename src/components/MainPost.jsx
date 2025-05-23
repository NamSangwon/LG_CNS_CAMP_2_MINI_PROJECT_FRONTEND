import { useState } from 'react';
import "./mainPage.css";
import { useNavigate } from "react-router-dom";
import likedHeart from "../assets/icons/likedheart.png";
import unlikedHeart from "../assets/icons/heart.png";
import comments_icon from "../assets/icons/message.png";
import { togglePostLike } from "../apis/userApi.js";
import ReactMarkdown from "react-markdown";
import { getLoggedInUserId } from "/src/utils/checkUser.js";


export default function MainPost({ post }) {
  const navigate = useNavigate();
  const {
    title,
    content,
    nickname,
    profile_img_code: profileImgCode,
    created_at: createdAt,
    post_id: postId,
    likes_count: initialLikesCount,
    liked,
    comments_count,
  } = post;

  const formattedDate = createdAt
    ? new Date(createdAt).toISOString().slice(0, 10)
    : "";

  const handleClick = () => {
    navigate(`/post/${postId}`);
  };

  const profileImages = import.meta.glob('../assets/images/profile/*.png', {
    eager: true,
    import: 'default'
  });
  const imgSrc = profileImages[`../assets/images/profile/profile_${profileImgCode}.png`];
  
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [likedState, setLikedState] = useState(liked);
  const heartImg = likedState ? likedHeart : unlikedHeart;

  const handleLike = async () => { 
    if (getLoggedInUserId() == null) {
        if (confirm("로그인하시겠습니까?")) 
          navigate('/login');
        return;
      }
    const next = !likedState;
    setLikedState(next);
    setLikesCount(prev => prev + (next ? 1 : -1));
    try {
      await togglePostLike(postId, next);
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      setLikedState(!next);
      setLikesCount(prev => prev - (next ? 1 : -1));
    }
  };

  return (
    <div className="summary_post">
      <div className="profile" onClick={handleClick}>
        <img src={imgSrc} alt="프로필 이미지" className="user_image" />
        <div className="user_nickname">
          <span className="preFix">Posted by </span>
          <span>{nickname} ·</span>
          <span className="preFix"> {formattedDate}</span>
        </div>
      </div>

      <div className="postTitle" onClick={handleClick}>{title}</div>

      <div className="post_contnet" onClick={handleClick}><ReactMarkdown>{content}</ReactMarkdown></div>

      <div className="icon_group">
        <img
          className="icon_button"
          onClick={handleLike}
          src={heartImg}
        />
        <span className="icon_text">{likesCount}</span>

        <div
          className="icon_button"
          style={{ backgroundImage: `url(${comments_icon})` }}
        />
        <span className="icon_text">{comments_count}</span>
      </div>
    </div>
  );
}
