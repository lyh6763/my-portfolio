import { supabase } from '../supabase';

/**
 * 저장된 게시물 관련 API 함수
 */

/**
 * 게시물 저장/저장 취소 토글
 * @param {number} postId - 게시물 ID
 * @param {number} userId - 사용자 ID
 */
export async function toggleSavePost(postId, userId) {
  // 기존 저장 확인
  const { data: existing } = await supabase
    .from('saved_posts')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    // 저장 취소
    await supabase.from('saved_posts').delete().eq('id', existing.id);
    return { saved: false };
  } else {
    // 저장
    await supabase.from('saved_posts').insert([{
      post_id: postId,
      user_id: userId
    }]);
    return { saved: true };
  }
}

/**
 * 게시물 저장 여부 확인
 * @param {number} postId - 게시물 ID
 * @param {number} userId - 사용자 ID
 */
export async function isPostSaved(postId, userId) {
  const { data } = await supabase
    .from('saved_posts')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  return !!data;
}

/**
 * 저장된 게시물 목록 조회
 * @param {number} userId - 사용자 ID
 */
export async function getSavedPosts(userId) {
  const { data, error } = await supabase
    .from('saved_posts')
    .select(`
      post:posts (
        *,
        user:users!posts_user_id_fkey (
          id, username, display_name, profile_image
        ),
        images:post_images (id, image_url, order_index)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(item => item.post);
}
