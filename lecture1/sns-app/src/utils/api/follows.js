import { supabase } from '../supabase';

/**
 * 팔로우 관련 API 함수
 */

/**
 * 팔로우/언팔로우 토글
 * @param {number} followerId - 팔로우 하는 사용자 ID
 * @param {number} followingId - 팔로우 받는 사용자 ID
 */
export async function toggleFollow(followerId, followingId) {
  // 기존 팔로우 확인
  const { data: existing } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single();

  if (existing) {
    // 언팔로우
    await supabase.from('follows').delete().eq('id', existing.id);
    return { following: false };
  } else {
    // 팔로우
    await supabase.from('follows').insert([{
      follower_id: followerId,
      following_id: followingId
    }]);
    return { following: true };
  }
}

/**
 * 팔로우 여부 확인
 * @param {number} followerId - 팔로우 하는 사용자 ID
 * @param {number} followingId - 팔로우 받는 사용자 ID
 */
export async function isFollowing(followerId, followingId) {
  const { data } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single();

  return !!data;
}

/**
 * 팔로워 목록 조회
 * @param {number} userId - 사용자 ID
 */
export async function getFollowers(userId) {
  const { data, error } = await supabase
    .from('follows')
    .select(`
      follower:users!follows_follower_id_fkey (
        id, username, display_name, profile_image
      )
    `)
    .eq('following_id', userId);

  if (error) throw error;
  return data.map(item => item.follower);
}

/**
 * 팔로잉 목록 조회
 * @param {number} userId - 사용자 ID
 */
export async function getFollowing(userId) {
  const { data, error } = await supabase
    .from('follows')
    .select(`
      following:users!follows_following_id_fkey (
        id, username, display_name, profile_image
      )
    `)
    .eq('follower_id', userId);

  if (error) throw error;
  return data.map(item => item.following);
}

/**
 * 팔로워 수 조회
 * @param {number} userId - 사용자 ID
 */
export async function getFollowersCount(userId) {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId);

  if (error) throw error;
  return count;
}

/**
 * 팔로잉 수 조회
 * @param {number} userId - 사용자 ID
 */
export async function getFollowingCount(userId) {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);

  if (error) throw error;
  return count;
}
