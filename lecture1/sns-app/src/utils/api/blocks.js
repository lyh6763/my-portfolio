import { supabase } from '../supabase';

/**
 * 차단 관련 API 함수
 */

/**
 * 사용자 차단/차단 해제 토글
 * @param {number} blockerId - 차단하는 사용자 ID
 * @param {number} blockedId - 차단당하는 사용자 ID
 */
export async function toggleBlock(blockerId, blockedId) {
  // 기존 차단 확인
  const { data: existing } = await supabase
    .from('blocks')
    .select('id')
    .eq('blocker_id', blockerId)
    .eq('blocked_id', blockedId)
    .single();

  if (existing) {
    // 차단 해제
    await supabase.from('blocks').delete().eq('id', existing.id);
    return { blocked: false };
  } else {
    // 차단
    await supabase.from('blocks').insert([{
      blocker_id: blockerId,
      blocked_id: blockedId
    }]);

    // 팔로우 관계도 삭제
    await supabase
      .from('follows')
      .delete()
      .or(`and(follower_id.eq.${blockerId},following_id.eq.${blockedId}),and(follower_id.eq.${blockedId},following_id.eq.${blockerId})`);

    return { blocked: true };
  }
}

/**
 * 차단 여부 확인
 * @param {number} blockerId - 차단하는 사용자 ID
 * @param {number} blockedId - 차단당하는 사용자 ID
 */
export async function isBlocked(blockerId, blockedId) {
  const { data } = await supabase
    .from('blocks')
    .select('id')
    .eq('blocker_id', blockerId)
    .eq('blocked_id', blockedId)
    .single();

  return !!data;
}

/**
 * 차단된 사용자 목록 조회
 * @param {number} userId - 사용자 ID
 */
export async function getBlockedUsers(userId) {
  const { data, error } = await supabase
    .from('blocks')
    .select(`
      blocked:users!blocks_blocked_id_fkey (
        id, username, display_name, profile_image
      )
    `)
    .eq('blocker_id', userId);

  if (error) throw error;
  return data.map(item => item.blocked);
}

/**
 * 차단 해제
 * @param {number} blockerId - 차단하는 사용자 ID
 * @param {number} blockedId - 차단당하는 사용자 ID
 */
export async function unblockUser(blockerId, blockedId) {
  const { error } = await supabase
    .from('blocks')
    .delete()
    .eq('blocker_id', blockerId)
    .eq('blocked_id', blockedId);

  if (error) throw error;
}
