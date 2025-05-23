import React, { useEffect, useState, useRef, useCallback } from "react";
import MainPost from "../components/MainPost";
import axiosInstance from "../apis/instance";

export default function HomePage() {
  const [posts, setPosts] = useState([]); // 게시글 목록
  const [page, setPage] = useState(0); // 현재 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 게시글 있는지 여부
  const loader = useRef(null); // 관찰할 div 요소 참조

  // 📌 게시글 가져오기
  const fetchPosts = useCallback(async () => {
    if (!hasMore) return;

    try {
      const res = await axiosInstance.get(`/post/list?page=${page}`);
      const newPosts = res.data;
      console.log("API response ▶", res.data);

      if (newPosts.length === 0) {
        setHasMore(false); // 더 이상 불러올 게시글 없음
      } else {
        setPosts((prev) => [...prev, ...newPosts]); // 기존 글에 이어 붙이기
        setPage((prev) => prev + 1); // 다음 페이지로 이동
      }
    } catch (error) {
      console.error("게시글 불러오기 실패", error);
    }
  }, [page, hasMore]);

  // 📌 IntersectionObserver로 하단 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      },
      { threshold: 1 }
    );

    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [fetchPosts]);

  

  console.log(posts);

  return (
    <div className="new_posts">
      {posts.map((post) => (
        <MainPost key={post.post_id} post={post} />
      ))}
      <div ref={loader} style={{ height: "60px" }}></div> {/* 감지용 div */}
    </div>
  );
}
