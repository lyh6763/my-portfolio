import { supabase } from '../supabase';

/**
 * 메시지 관련 API 함수
 */

/**
 * 대화 목록 조회
 * @param {number} userId - 사용자 ID
 */
export async function getConversations(userId) {
  const { data, error } = await supabase
    .from('conversation_participants')
    .select(`
      conversation:conversations (
        id,
        updated_at
      ),
      is_pinned,
      is_muted,
      last_read_at
    `)
    .eq('user_id', userId)
    .order('conversation(updated_at)', { ascending: false });

  if (error) throw error;

  // 각 대화에 대해 상대방 정보와 마지막 메시지 조회
  const conversations = await Promise.all(
    data.map(async (item) => {
      // 상대방 조회
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select(`
          user:users!conversation_participants_user_id_fkey (
            id, username, display_name, profile_image, is_online
          )
        `)
        .eq('conversation_id', item.conversation.id)
        .neq('user_id', userId);

      // 마지막 메시지 조회
      const { data: lastMessage } = await supabase
        .from('messages')
        .select('content, created_at, is_read')
        .eq('conversation_id', item.conversation.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // 읽지 않은 메시지 수 조회
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', item.conversation.id)
        .neq('sender_id', userId)
        .eq('is_read', false);

      return {
        id: item.conversation.id,
        otherUser: participants?.[0]?.user,
        lastMessage,
        unreadCount,
        isPinned: item.is_pinned,
        isMuted: item.is_muted
      };
    })
  );

  return conversations;
}

/**
 * 대화 메시지 조회
 * @param {number} conversationId - 대화 ID
 * @param {number} limit - 조회할 개수
 * @param {number} offset - 시작 위치
 */
export async function getMessages(conversationId, limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users!messages_sender_id_fkey (
        id, username, display_name, profile_image
      )
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data.reverse();
}

/**
 * 메시지 전송
 * @param {object} messageData - 메시지 데이터
 * @param {number} messageData.conversationId - 대화 ID
 * @param {number} messageData.senderId - 발신자 ID
 * @param {string} messageData.content - 메시지 내용
 * @param {string} messageData.imageUrl - 이미지 URL
 */
export async function sendMessage({ conversationId, senderId, content, imageUrl = null }) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      image_url: imageUrl
    }])
    .select(`
      *,
      sender:users!messages_sender_id_fkey (
        id, username, display_name, profile_image
      )
    `)
    .single();

  if (error) throw error;

  // 대화 업데이트 시간 갱신
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data;
}

/**
 * 새 대화 시작
 * @param {number} userId1 - 사용자 1 ID
 * @param {number} userId2 - 사용자 2 ID
 */
export async function createConversation(userId1, userId2) {
  // 기존 대화 확인
  const { data: existing } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', userId1);

  if (existing) {
    for (const item of existing) {
      const { data: hasOther } = await supabase
        .from('conversation_participants')
        .select('id')
        .eq('conversation_id', item.conversation_id)
        .eq('user_id', userId2)
        .single();

      if (hasOther) {
        return { id: item.conversation_id, isNew: false };
      }
    }
  }

  // 새 대화 생성
  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert([{}])
    .select()
    .single();

  if (error) throw error;

  // 참여자 추가
  await supabase.from('conversation_participants').insert([
    { conversation_id: conversation.id, user_id: userId1 },
    { conversation_id: conversation.id, user_id: userId2 }
  ]);

  return { id: conversation.id, isNew: true };
}

/**
 * 메시지 읽음 처리
 * @param {number} conversationId - 대화 ID
 * @param {number} userId - 사용자 ID
 */
export async function markMessagesAsRead(conversationId, userId) {
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .eq('is_read', false);

  await supabase
    .from('conversation_participants')
    .update({ last_read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .eq('user_id', userId);
}
