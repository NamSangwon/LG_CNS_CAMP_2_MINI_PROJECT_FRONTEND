import axiosInstance from './instance';

function ensureAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.alert("로그인 후 이용 가능합니다.");
    window.location.href = '/login';
    return null;
  }
  return token;
}

function handle403Error(error) {
  if (error.response?.status === 403) {
    localStorage.removeItem('token');
    window.alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
    window.location.href = '/login';
  } else {
    console.error(error);
  }
}

export async function fetchUserById() {
  const token = ensureAuth();
  if (!token) return;
  try {
    const { data } = await axiosInstance.get('/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    handle403Error(error);
  }
}

export async function fetchUserPosts(offset, limit) {
  const token = ensureAuth();
  if (!token) return;
  try {
    const { data } = await axiosInstance.get('/user/posts', {
      headers: { Authorization: `Bearer ${token}` },
      params: { offset, limit },
    });
    return data;
  } catch (error) {
    handle403Error(error);
  }
}

export async function fetchUserLiked(offset, limit) {
  const token = ensureAuth();
  if (!token) return;
  try {
    const { data } = await axiosInstance.get('/user/liked', {
      headers: { Authorization: `Bearer ${token}` },
      params: { offset, limit },
    });
    return data;
  } catch (error) {
    handle403Error(error);
  }
}

export async function fetchUserComments(offset, limit) {
  const token = ensureAuth();
  if (!token) return;
  try {
    const { data } = await axiosInstance.get('/user/comments', {
      headers: { Authorization: `Bearer ${token}` },
      params: { offset, limit },
    });
    return data;
  } catch (error) {
    handle403Error(error);
  }
}

export async function updateUserInfo(updatedInfo) {
  const token = ensureAuth();
  if (!token) return;
  try {
    await axiosInstance.post('/user/update', updatedInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    handle403Error(error);
  }
}

export async function updatePostVisibility(postId, isPublic) {
  const token = ensureAuth();
  if (!token) return;
  try {
    await axiosInstance.patch(
      `/post/${postId}`,
      { isPublic },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    handle403Error(error);
  }
}

export async function togglePostLike(postId, liked) {
  const token = ensureAuth();
  if (!token) return;
  try {
    await axiosInstance.post(
      `/like/${postId}`,
      { isLike: liked },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    handle403Error(error);
  }
}

export async function deleteComment(commentId) {
  const token = ensureAuth();
  if (!token) return;
  try {
    await axiosInstance.delete(`/comment/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handle403Error(error);
  }
}