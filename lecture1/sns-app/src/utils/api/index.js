/**
 * Supabase API 함수 모음
 *
 * 사용 예시:
 * import { getFeedPosts, togglePostLike } from '@/utils/api';
 */

// 게시물 관련
export {
  getFeedPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts
} from './posts';

// 댓글 관련
export {
  getPostComments,
  createComment,
  deleteComment,
  toggleCommentLike
} from './comments';

// 좋아요 관련
export {
  togglePostLike,
  isPostLiked,
  getPostLikesCount,
  getPostLikedUsers
} from './likes';

// 팔로우 관련
export {
  toggleFollow,
  isFollowing,
  getFollowers,
  getFollowing,
  getFollowersCount,
  getFollowingCount
} from './follows';

// 메시지 관련
export {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  markMessagesAsRead
} from './messages';

// 알림 관련
export {
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
  getNotificationSettings,
  updateNotificationSettings
} from './notifications';

// 사용자 관련
export {
  getUserProfile,
  updateUserProfile,
  searchUsers,
  getUserStats,
  updateOnlineStatus,
  changePassword,
  deleteAccount
} from './users';

// 저장된 게시물 관련
export {
  toggleSavePost,
  isPostSaved,
  getSavedPosts
} from './saved-posts';

// 차단 관련
export {
  toggleBlock,
  isBlocked,
  getBlockedUsers,
  unblockUser
} from './blocks';

// 검색 관련
export {
  searchAll,
  searchUsers as searchUsersByQuery,
  searchPosts,
  searchHashtags,
  getPostsByHashtag,
  getExplorePosts,
  getTrendingHashtags
} from './search';
