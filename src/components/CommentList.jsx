import { useEffect, useCallback, useRef } from 'react';
import { fetchComments } from "../apis/postApi.js";

import CommentItem from './CommentItem';

import useInfiniteList from '../hooks/useInfiniteList.js';
import "./commentList.css";

export default function CommentList({ postId, setCommentCount, commentRefreshTrigger }) {
    const isInit = useRef(true);

    const commentsFetcher = useCallback(async (offset, limit) => {
        return fetchComments(postId, offset, limit);
    }, []);

    const {
        items: comments,
        hasMore,
        loading,
        lastRef,
        reset
    } = useInfiniteList(commentsFetcher, 10);

    useEffect(() => {
        // useInfiniteList 와의 중복 조회 방지
        if (isInit.current) {
            isInit.current = false;
            return;
        }

        reset();
    }, [commentRefreshTrigger])

    return (
        <>
            <div className="comment_list">
                {
                    comments.map((comment, index) => {
                        const isLastComment = comments.length === index + 1; // for useInfiniteList
                        return (
                            <CommentItem
                                key={comment.commentId} 
                                ref={isLastComment ? lastRef : null}
                                comment={comment}
                                setCommentCount={setCommentCount}
                                reset={reset}
                            />
                        )
                    })
                }
                {loading && <p>댓글 로딩 중...</p>}
            </div>
        </>
    );
}