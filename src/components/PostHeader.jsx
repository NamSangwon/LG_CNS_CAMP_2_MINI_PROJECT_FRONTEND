import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { checkOwner } from "../utils/checkUser.js";
import { updatePublicState } from "../apis/postApi";

import messageIcon from "../assets/icons/message.png";

import "./postHeader.css";

export default function PostHeader({ post }) {
    const profileImages = import.meta.glob("../assets/images/profile/*.png", {
        eager: true,
        import: "default",
    });
    const imgSrc =  profileImages[`../assets/images/profile/profile_${post.profileImg}.png`];

    const [publicState, setPublicState] = useState(post?.isPublic || false);

    const handleTogglePublic = () => {
        try {
            if (!post || !post.postId) throw new Error("postId is NULL");

            if (!checkOwner(post?.userId)) {
                alert("게시물 소유자만 공개 상태를 변경할 수 있습니다.");
                return;
            }

            const changedPublicValue = !publicState;

            updatePublicState(post.postId, changedPublicValue);

            setPublicState(changedPublicValue);

        } catch (error) {
            console.error("공개 상태 업데이트 실패:", error);

            alert('공개 상태 업데이트에 실패했습니다.');
        }
    };

    return (
        <>
            <div className="post_header">
                <h1 className="post_title">{post.title}</h1>
                <div className="profile_info_bar">
                    <div className="profile_details">
                        <img className="profile_avatar" src={imgSrc} alt="Profile Avatar" />
                        <span className="posted_by_text">Posted by <span className="author_name">{post.nickname}</span> · {new Date(post.createdAt).toLocaleString("ko-KR")}</span>
                    </div>
                    {
                        checkOwner(post.userId) ? (
                            <div className="actions_right">
                                <Link to={`/chat?chatId=${post.chatId}`}>
                                    <img className="notification_icon" src={messageIcon} />
                                </Link>
                                <label className="toggle_switch">
                                    <input type="checkbox" checked={publicState} onChange={handleTogglePublic} />
                                    <span className="post_slider round"></span>
                                </label>
                            </div>
                        ) : null
                    }
                </div>
            </div>
        </>
    );
}