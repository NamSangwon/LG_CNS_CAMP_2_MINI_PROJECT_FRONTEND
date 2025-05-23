import { updateLikeState } from "../apis/postApi";
import { getLoggedInUserId } from "../utils/checkUser.js";
import { useNavigate } from "react-router-dom"; 

import heartIcon from "../assets/icons/heart.png";
import likedHeartIcon from "../assets/icons/likedheart.png";
import messageIcon from "../assets/icons/message.png";

import "./postActionItem.css";

export default function PostActionItem({
    post,
    likeState,
    setLikeState,
    likeCount,
    setLikeCount,
    commentCount
}) {
    const navigate = useNavigate();

    const handleToggleLike = async () => {
        try {
            if (!post || !post.postId) throw new Error("postId is NULL");

            if (getLoggedInUserId() == null) {
                if (confirm("로그인하시겠습니까?"))
                    navigate('/login');
                return;
            }

            const changedLikeValue = !likeState;
            const newLikeCount = await updateLikeState(post.postId, changedLikeValue);

            setLikeState(changedLikeValue);
            setLikeCount(newLikeCount);

        } catch (error) {
            console.error("좋아요 업데이트 실패:", error);
            alert('좋아요 업데이트에 실패했습니다. 다시 시도해주세요.');
        }
    }    

    return (
        <>
            <div className="post_actions_summary">
                <div className="action_item" onClick={handleToggleLike}>
                    {
                        likeState ?
                            (<img src={likedHeartIcon} alt="Likes" className="action_icon" />)
                            : (<img src={heartIcon} alt="Likes" className="action_icon" />)
                    }
                    <span className="action_count">{likeCount}</span>
                </div>
                <div className="action_item">
                    <img src={messageIcon} alt="Comments" className="action_icon" />
                    <span className="action_count">{commentCount}</span>
                </div>
            </div>
        </>
    );
}