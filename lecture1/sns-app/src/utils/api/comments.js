import { supabase } from '../supabase';

/**
 * 댓글 관련 API 함수
 */

/**
 * 게시물 댓글 목록 조회
 * @param {number} postId - 게시물 ID
 */
export async function getPostComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:users!comments_user_id_fkey (
        id, username, display_name, profile_image
      ),
      replies:comments!comments_parent_id_fkey (
        id, content, created_at,
        user:users!comments_user_id_fkey (
          id, username, display_name, profile_image
        )
      )
    `)
    .eq('post_id', postId)
    .is('parent_id', null)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * 댓글 작성
 * @param {object} commentData - 댓글 데이터
 * @param {number} commentData.postId - 게시물 ID
 * @param {number} commentData.userId - 작성자 ID
 * @param {string} commentData.content - 댓글 내용
 * @param {number} commentData.parentId - 부모 댓글 ID (답글인 경우)
 */
export async function createComment({ postId, userId, content, parentId = null }) {
  const { data, error } = await supabase
    .from('comments')
    .insert([{
      post_id: postId,
      user_id: userId,
      content,
      parent_id: parentId
    }])
    .select(`
      *,
      user:users!comments_user_id_fkey (
        id, username, display_name, profile_image
      )
    `)
    .single();

  if (error) throw error;
  return data;
}

/**
 * 댓글 삭제
 * @param {number} commentId - 댓글 ID
 */
export async function deleteComment(commentId) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
}

/**
 * 댓글 좋아요 토글
 * @param {number} commentId - 댓글 ID
 * @param {number} userId - 사용자 ID
 */
export async function toggleCommentLike(commentId, userId) {
  // 기존 좋아요 확인
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    // 좋아요 취소
    await supabase.from('likes').delete().eq('id', existing.id);
    return { liked: false };
  } else {
    // 좋아요 추가
    await supabase.from('likes').insert([{
      comment_id: commentId,
      user_id: userId
    }]);
    return { liked: true };
  }
}
