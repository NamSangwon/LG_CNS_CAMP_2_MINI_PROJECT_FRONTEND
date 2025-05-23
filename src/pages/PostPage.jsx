import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from 'react';

import { getLoggedInUserId } from "../utils/checkUser.js";
import { fetchPost } from "../apis/postApi";

import PostHeader from "../components/PostHeader";
import PostContent from "../components/PostContent";
import PostFooter from "../components/PostFooter";

import "./postPage.css";

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const initPost = async () => {
      try {
        if (postId != null) {
          const userId = getLoggedInUserId();
          const data = await fetchPost(postId, userId);
          setPost(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    initPost();
  }, [postId]);

  return (
    post === null ?
      <div className="loading_state">게시물을 불러오는 중입니다...</div> : (
        <>
          <div className="post_container">
            <PostHeader post={post} />
            <PostContent post={post} />
            <PostFooter post={post}/>
          </div >
        </>
      )
  );
}
