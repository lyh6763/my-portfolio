import { supabase } from '../supabase';

/**
 * 알림 관련 API 함수
 */

/**
 * 알림 목록 조회
 * @param {number} userId - 사용자 ID
 * @param {number} limit - 조회할 개수
 */
export async function getNotifications(userId, limit = 50) {
  const { data, error } = await supabase
    .from('notifications')
    .select(`
      *,
      actor:users!notifications_actor_id_fkey (
        id, username, display_name, profile_image
      ),
      post:posts (
        id,
        images:post_images (image_url, order_index)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * 읽지 않은 알림 수 조회
 * @param {number} userId - 사용자 ID
 */
export async function getUnreadNotificationsCount(userId) {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
  return count;
}

/**
 * 알림 읽음 처리
 * @param {number} notificationId - 알림 ID
 */
export async function markNotificationAsRead(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
}

/**
 * 모든 알림 읽음 처리
 * @param {number} userId - 사용자 ID
 */
export async function markAllNotificationsAsRead(userId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
}

/**
 * 알림 생성 (내부 사용)
 * @param {object} notificationData - 알림 데이터
 */
export async function createNotification({ userId, actorId, type, postId = null, commentId = null }) {
  // 자기 자신에게 알림을 보내지 않음
  if (userId === actorId) return;

  const { error } = await supabase
    .from('notifications')
    .insert([{
      user_id: userId,
      actor_id: actorId,
      type,
      post_id: postId,
      comment_id: commentId
    }]);

  if (error) throw error;
}

/**
 * 알림 설정 조회
 * @param {number} userId - 사용자 ID
 */
export async function getNotificationSettings(userId) {
  let { data, error } = await supabase
    .from('notification_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  // 설정이 없으면 기본값 생성
  if (!data) {
    const { data: newSettings, error: createError } = await supabase
      .from('notification_settings')
      .insert([{ user_id: userId }])
      .select()
      .single();

    if (createError) throw createError;
    data = newSettings;
  }

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

/**
 * 알림 설정 업데이트
 * @param {number} userId - 사용자 ID
 * @param {object} settings - 설정 데이터
 */
export async function updateNotificationSettings(userId, settings) {
  const { data, error } = await supabase
    .from('notification_settings')
    .update({
      ...settings,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
