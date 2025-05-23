import { useState, useEffect } from "react";

import PostActionItem from "../components/PostActionItem";
import PostComment from "../components/PostComment";

export default function PostFooter({ post }) {
    const [likeState, setLikeState] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);

    useEffect(() => {
        if (post != null) {
            setLikeState(post.isLike);
            setLikeCount(post.likeCount);
            setCommentCount(post.commentCount);
        }
    }, [post])

    return (
        post === null ? <div className="loading_state">로딩중...</div> : (
            <>
                <PostActionItem
                    post={post}
                    likeState={likeState}
                    setLikeState={setLikeState}
                    likeCount={likeCount}
                    setLikeCount={setLikeCount}
                    commentCount={commentCount}
                />
                <PostComment
                    post={post}
                    setCommentCount={setCommentCount}
                    commentCount={commentCount}
                />
            </>
        )
    );
}