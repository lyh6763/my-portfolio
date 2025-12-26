import { supabase } from '../supabase';

/**
 * 검색 관련 API 함수
 */

/**
 * 통합 검색 (유저, 게시물, 해시태그)
 * @param {string} query - 검색어
 */
export async function searchAll(query) {
  const [users, posts, hashtags] = await Promise.all([
    searchUsers(query),
    searchPosts(query),
    searchHashtags(query)
  ]);

  return { users, posts, hashtags };
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
 * 게시물 검색 (캡션 기준)
 * @param {string} query - 검색어
 * @param {number} limit - 조회할 개수
 */
export async function searchPosts(query, limit = 30) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      images:post_images (id, image_url, order_index)
    `)
    .ilike('caption', `%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * 해시태그 검색
 * @param {string} query - 검색어
 * @param {number} limit - 조회할 개수
 */
export async function searchHashtags(query, limit = 20) {
  const { data, error } = await supabase
    .from('hashtags')
    .select('id, name, post_count')
    .ilike('name', `%${query}%`)
    .order('post_count', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * 해시태그로 게시물 검색
 * @param {string} hashtagName - 해시태그 이름
 * @param {number} limit - 조회할 개수
 */
export async function getPostsByHashtag(hashtagName, limit = 30) {
  // 해시태그 ID 조회
  const { data: hashtag } = await supabase
    .from('hashtags')
    .select('id')
    .eq('name', hashtagName)
    .single();

  if (!hashtag) return [];

  // 해당 해시태그를 가진 게시물 조회
  const { data, error } = await supabase
    .from('post_hashtags')
    .select(`
      post:posts (
        *,
        user:users!posts_user_id_fkey (
          id, username, display_name, profile_image
        ),
        images:post_images (id, image_url, order_index)
      )
    `)
    .eq('hashtag_id', hashtag.id)
    .limit(limit);

  if (error) throw error;
  return data.map(item => item.post);
}

/**
 * 추천 게시물 조회 (탐색 탭용)
 * @param {number} limit - 조회할 개수
 */
export async function getExplorePosts(limit = 30) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      images:post_images (id, image_url, order_index)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * 인기 해시태그 조회
 * @param {number} limit - 조회할 개수
 */
export async function getTrendingHashtags(limit = 10) {
  const { data, error } = await supabase
    .from('hashtags')
    .select('id, name, post_count')
    .order('post_count', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
