import { supabase } from '../supabase';

/**
 * 좋아요 관련 API 함수
 */

/**
 * 게시물 좋아요 토글
 * @param {number} postId - 게시물 ID
 * @param {number} userId - 사용자 ID
 */
export async function togglePostLike(postId, userId) {
  // 기존 좋아요 확인
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    // 좋아요 취소
    await supabase.from('likes').delete().eq('id', existing.id);
    return { liked: false };
  } else {
    // 좋아요 추가
    await supabase.from('likes').insert([{
      post_id: postId,
      user_id: userId
    }]);
    return { liked: true };
  }
}

/**
 * 게시물 좋아요 여부 확인
 * @param {number} postId - 게시물 ID
 * @param {number} userId - 사용자 ID
 */
export async function isPostLiked(postId, userId) {
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  return !!data;
}

/**
 * 게시물 좋아요 수 조회
 * @param {number} postId - 게시물 ID
 */
export async function getPostLikesCount(postId) {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  if (error) throw error;
  return count;
}

/**
 * 게시물 좋아요한 사용자 목록 조회
 * @param {number} postId - 게시물 ID
 */
export async function getPostLikedUsers(postId) {
  const { data, error } = await supabase
    .from('likes')
    .select(`
      user:users!likes_user_id_fkey (
        id, username, display_name, profile_image
      )
    `)
    .eq('post_id', postId);

  if (error) throw error;
  return data.map(item => item.user);
}
