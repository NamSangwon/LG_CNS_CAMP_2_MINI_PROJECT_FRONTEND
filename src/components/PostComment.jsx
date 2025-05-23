import React, { useState, useRef, useEffect } from "react";
import { createComment } from "../apis/postApi";
import { getLoggedInUserId } from "../utils/checkUser.js";
import { useNavigate } from "react-router-dom"; // navigate 임포트 추가

import CommentList from "./CommentList";

import "./postComment.css";

export default function PostComment({ post, setCommentCount, commentCount }) {
    const navigate = useNavigate();
    const inputCommentRef = useRef("");
    const [commentRefreshTrigger, setCommentRefreshTrigger] = useState(0);

    const handleCreateComment = async () => {
        try {
            if (getLoggedInUserId() == null) {
                if (confirm("로그인하시겠습니까?"))
                    navigate('/login');
                return;
            }

            const commentContent = inputCommentRef.current.value;
            if (!commentContent.trim()) {
                alert("댓글 내용을 입력해주세요.");
                return;
            }

            if (!post || !post.postId) {
                console.error("게시물 정보가 없거나 postId가 없습니다.");
                return;
            }

            const newCommentCount = await createComment(post.postId, commentContent);

            setCommentRefreshTrigger(prev => prev + 1);
            setCommentCount(newCommentCount);

            if (inputCommentRef.current) {
                inputCommentRef.current.value = ''; 
            }
        } catch (error) {
            console.error("댓글 작성 실패:", error);
            alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
        }
    }

    return (
        <>
            <h3 className="comments_heading">{commentCount}개의 댓글</h3>
            <div className="comment_input_section">
                <textarea className="comment_textarea" placeholder="댓글을 작성하세요..." ref={inputCommentRef} />
                <button className="submit_comment_button" onClick={handleCreateComment}>댓글 작성</button>
            </div>

            <CommentList
                postId={post.postId}
                setCommentCount={setCommentCount}
                commentRefreshTrigger={commentRefreshTrigger}
            />
        </>
    );
}