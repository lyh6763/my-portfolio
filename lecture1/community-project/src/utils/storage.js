/**
 * Supabase 데이터베이스 연동 유틸리티 함수
 */

import { supabase } from './supabase';

const STORAGE_KEYS = {
  CURRENT_USER: 'gamelounge_currentUser',
};

/**
 * 사용자 등록
 * @param {object} user - 등록할 사용자 정보
 * @returns {Promise<boolean>} 성공 여부
 */
export const registerUser = async (user) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ username: user.username, password: user.password }])
    .select()
    .single();

  if (error) {
    console.error('Register error:', error);
    return false;
  }
  return true;
};

/**
 * 로그인 검증
 * @param {string} username - 아이디
 * @param {string} password - 비밀번호
 * @returns {Promise<object|null>} 사용자 정보 또는 null
 */
export const loginUser = async (username, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error || !data) {
    return null;
  }

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data));
  return data;
};

/**
 * 현재 로그인된 사용자 조회
 * @returns {object|null} 현재 사용자 정보
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

/**
 * 로그아웃
 */
export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

/**
 * 게시물 목록 조회
 * @returns {Promise<Array>} 게시물 목록
 */
export const getPosts = async () => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:users(id, username),
      comments(id),
      likes(id, user_id)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get posts error:', error);
    return [];
  }

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    author: post.author?.username || 'Unknown',
    authorId: post.author_id,
    createdAt: post.created_at,
    likes: post.likes?.length || 0,
    likedBy: post.likes?.map((l) => l.user_id) || [],
    commentsCount: post.comments?.length || 0,
  }));
};

/**
 * 게시물 상세 조회
 * @param {number} id - 게시물 ID
 * @returns {Promise<object|null>} 게시물 정보
 */
export const getPostById = async (id) => {
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:users(id, username),
      comments(
        id,
        content,
        created_at,
        author:users(id, username)
      ),
      likes(id, user_id)
    `)
    .eq('id', id)
    .single();

  if (error || !post) {
    console.error('Get post error:', error);
    return null;
  }

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    author: post.author?.username || 'Unknown',
    authorId: post.author_id,
    createdAt: post.created_at,
    likes: post.likes?.length || 0,
    likedBy: post.likes?.map((l) => l.user_id) || [],
    comments: (post.comments || []).map((c) => ({
      id: c.id,
      content: c.content,
      author: c.author?.username || 'Unknown',
      authorId: c.author?.id,
      createdAt: c.created_at,
    })).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
  };
};

/**
 * 게시물 작성
 * @param {object} post - 게시물 정보
 * @returns {Promise<object|null>} 생성된 게시물
 */
export const createPost = async (post) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([{
      title: post.title,
      content: post.content,
      author_id: post.authorId,
    }])
    .select()
    .single();

  if (error) {
    console.error('Create post error:', error);
    return null;
  }

  return data;
};

/**
 * 좋아요 토글
 * @param {number} postId - 게시물 ID
 * @param {number} userId - 사용자 ID
 * @returns {Promise<object|null>} 업데이트된 게시물
 */
export const toggleLike = async (postId, userId) => {
  const { data: existingLike } = await supabase
    .from('likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
  } else {
    await supabase
      .from('likes')
      .insert([{ post_id: postId, user_id: userId }]);
  }

  return await getPostById(postId);
};

/**
 * 댓글 추가
 * @param {number} postId - 게시물 ID
 * @param {object} comment - 댓글 정보
 * @returns {Promise<object|null>} 업데이트된 게시물
 */
export const addComment = async (postId, comment) => {
  const { error } = await supabase
    .from('comments')
    .insert([{
      content: comment.content,
      author_id: comment.authorId,
      post_id: postId,
    }]);

  if (error) {
    console.error('Add comment error:', error);
    return null;
  }

  return await getPostById(postId);
};
