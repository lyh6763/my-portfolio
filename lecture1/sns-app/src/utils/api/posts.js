import { supabase } from '../supabase';

/**
 * 게시물 관련 API 함수
 */

/**
 * 피드 게시물 목록 조회
 * @param {number} limit - 조회할 개수
 * @param {number} offset - 시작 위치
 */
export async function getFeedPosts(limit = 10, offset = 0) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      user:users!posts_user_id_fkey (
        id, username, display_name, profile_image
      ),
      images:post_images (
        id, image_url, order_index
      ),
      likes_count:likes(count),
      comments_count:comments(count)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
}

/**
 * 게시물 상세 조회
 * @param {number} postId - 게시물 ID
 */
export async function getPostById(postId) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      user:users!posts_user_id_fkey (
        id, username, display_name, profile_image
      ),
      images:post_images (
        id, image_url, order_index
      ),
      hashtags:post_hashtags (
        hashtag:hashtags (id, name)
      )
    `)
    .eq('id', postId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * 게시물 작성
 * @param {object} postData - 게시물 데이터
 * @param {number} postData.userId - 작성자 ID
 * @param {string} postData.caption - 게시물 내용
 * @param {string} postData.location - 위치
 * @param {string[]} postData.imageUrls - 이미지 URL 배열
 * @param {string[]} postData.hashtags - 해시태그 배열
 */
export async function createPost({ userId, caption, location, imageUrls = [], hashtags = [] }) {
  // 1. 게시물 생성
  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert([{ user_id: userId, caption, location }])
    .select()
    .single();

  if (postError) throw postError;

  // 2. 이미지 추가
  if (imageUrls.length > 0) {
    const images = imageUrls.map((url, index) => ({
      post_id: post.id,
      image_url: url,
      order_index: index
    }));
    await supabase.from('post_images').insert(images);
  }

  // 3. 해시태그 추가
  for (const tagName of hashtags) {
    // 해시태그 찾기 또는 생성
    let { data: tag } = await supabase
      .from('hashtags')
      .select('id')
      .eq('name', tagName)
      .single();

    if (!tag) {
      const { data: newTag } = await supabase
        .from('hashtags')
        .insert([{ name: tagName }])
        .select()
        .single();
      tag = newTag;
    }

    // 게시물-해시태그 연결
    await supabase.from('post_hashtags').insert([{
      post_id: post.id,
      hashtag_id: tag.id
    }]);
  }

  return post;
}

/**
 * 게시물 수정
 * @param {number} postId - 게시물 ID
 * @param {object} updates - 수정할 데이터
 */
export async function updatePost(postId, updates) {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 게시물 삭제
 * @param {number} postId - 게시물 ID
 */
export async function deletePost(postId) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}

/**
 * 사용자 게시물 목록 조회
 * @param {number} userId - 사용자 ID
 */
export async function getUserPosts(userId) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      images:post_images (id, image_url, order_index)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
