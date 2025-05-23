import { useState, useEffect, useRef } from "react";
import useUserInfo from "../hooks/useUserInfo";
import MyPageHeader from "../components/MypageHeader";
import MyPageNav from "../components/MyPageNav";

import {
  fetchUserPosts,
  fetchUserComments,
  fetchUserLiked,
} from "../apis/userApi";
import useInfiniteList from "../hooks/useInfiniteList";
import UserPostCard from "../components/UserPostCard";
import UserCommentCard from "../components/UserCommentCard";

export default function MyPage() {
  const { user, loading, error, refetch } = useUserInfo();
  const [activeTab, setActiveTab] = useState("내 게시글");
  const tabs = ["내 게시글", "관심 게시글", "내 댓글"];

  const postList = useInfiniteList(fetchUserPosts, 10);
  const likedList = useInfiniteList(fetchUserLiked, 10);
  const commentList = useInfiniteList(fetchUserComments, 10);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (activeTab === "내 게시글") postList.reset();
    if (activeTab === "관심 게시글") likedList.reset();
    if (activeTab === "내 댓글") commentList.reset();
  }, [activeTab]);

  const handleRetrySuccess = () => {
    if (activeTab === "내 게시글") postList.reset();
    if (activeTab === "관심 게시글") likedList.reset();
    if (activeTab === "내 댓글") commentList.reset();
  };

  const handleCommentDelete = () => {
    commentList.reset();
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생</div>;

  return (
    <div className="mypage">
      <MyPageHeader user={user} onUpdate={refetch} />
      <MyPageNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <section>
        {activeTab === "내 게시글" && (
          <div>
            {postList.items
              .slice()
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((post, i) =>
                i === postList.items.length - 1 ? (
                  <div key={post.post_id} ref={postList.lastRef}>
                    <UserPostCard
                      post={post}
                      nickname={post.author_name}
                      onRetrySuccess={handleRetrySuccess}
                    />
                  </div>
                ) : (
                  <UserPostCard
                    key={post.post_id}
                    post={post}
                    nickname={post.author_name}
                    onRetrySuccess={handleRetrySuccess}
                  />
                )
              )}
            {postList.loading && <div className="loading">로딩 중...</div>}
            {!postList.hasMore && (
              <div className="end">모든 게시물을 불러왔습니다</div>
            )}
          </div>
        )}

        {activeTab === "관심 게시글" && (
          <div>
            {likedList.items
              .slice()
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((post, i) =>
                i === likedList.items.length - 1 ? (
                  <div key={post.post_id} ref={likedList.lastRef}>
                    <UserPostCard
                      post={post}
                      showAuthor={true}
                      nickname={post.author_name}
                      onLikeChange={likedList.reset}
                    />
                  </div>
                ) : (
                  <UserPostCard
                    key={post.post_id}
                    post={post}
                    showAuthor={true}
                    nickname={post.author_name}
                    onLikeChange={likedList.reset}
                  />
                )
              )}
            {likedList.loading && <div className="loading">로딩 중...</div>}
            {!likedList.hasMore && (
              <div className="end">모든 게시물을 불러왔습니다</div>
            )}
          </div>
        )}

        {activeTab === "내 댓글" && (
          <div>
            {commentList.items
              .slice()
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((c, i, arr) =>
                i === arr.length - 1 ? (
                  <div key={c.comment_id} ref={commentList.lastRef}>
                    <UserCommentCard
                      comment={c}
                      onDelete={handleCommentDelete}
                    />
                  </div>
                ) : (
                  <UserCommentCard
                    key={c.comment_id}
                    comment={c}
                    onDelete={handleCommentDelete}
                  />
                )
              )}
            {commentList.loading && <div className="loading">로딩 중…</div>}
            {!commentList.hasMore && (
              <div className="end">모든 댓글을 불러왔습니다</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
