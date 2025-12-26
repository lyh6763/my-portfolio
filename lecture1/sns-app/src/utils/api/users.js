import { supabase } from '../supabase';

/**
 * 사용자 관련 API 함수
 */

/**
 * 사용자 프로필 조회
 * @param {number} userId - 사용자 ID
 */
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * 사용자 프로필 업데이트
 * @param {number} userId - 사용자 ID
 * @param {object} updates - 업데이트할 데이터
 */
export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 사용자 검색
 * @param {string} query - 검색어
 * @param {number} limit - 조회할 개수
 */
export async function searchUsers(query, limit = 20) {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, display_name, profile_image')
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * 사용자 통계 조회 (게시물 수, 팔로워 수, 팔로잉 수)
 * @param {number} userId - 사용자 ID
 */
export async function getUserStats(userId) {
  const [postsResult, followersResult, followingResult] = await Promise.all([
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId),
    supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId)
  ]);

  return {
    postsCount: postsResult.count || 0,
    followersCount: followersResult.count || 0,
    followingCount: followingResult.count || 0
  };
}

/**
 * 온라인 상태 업데이트
 * @param {number} userId - 사용자 ID
 * @param {boolean} isOnline - 온라인 여부
 */
export async function updateOnlineStatus(userId, isOnline) {
  const { error } = await supabase
    .from('users')
    .update({
      is_online: isOnline,
      last_active_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) throw error;
}

/**
 * 비밀번호 변경
 * @param {number} userId - 사용자 ID
 * @param {string} currentPassword - 현재 비밀번호
 * @param {string} newPassword - 새 비밀번호
 */
export async function changePassword(userId, currentPassword, newPassword) {
  // 현재 비밀번호 확인
  const { data: user } = await supabase
    .from('users')
    .select('password')
    .eq('id', userId)
    .single();

  if (user.password !== currentPassword) {
    throw new Error('현재 비밀번호가 일치하지 않습니다.');
  }

  const { error } = await supabase
    .from('users')
    .update({ password: newPassword })
    .eq('id', userId);

  if (error) throw error;
}

/**
 * 회원 탈퇴
 * @param {number} userId - 사용자 ID
 * @param {string} password - 비밀번호 확인
 */
export async function deleteAccount(userId, password) {
  // 비밀번호 확인
  const { data: user } = await supabase
    .from('users')
    .select('password')
    .eq('id', userId)
    .single();

  if (user.password !== password) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) throw error;
}
