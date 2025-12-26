import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

// 샘플 알림 데이터
const sampleNotifications = [
  {
    id: '1',
    type: 'like',
    actor: { id: 'user1', displayName: '김철수', profileImage: 'https://picsum.photos/seed/noti1/200' },
    postId: 'post1',
    postImage: 'https://picsum.photos/seed/post1/100',
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '2',
    type: 'follow',
    actor: { id: 'user2', displayName: '이영희', profileImage: 'https://picsum.photos/seed/noti2/200' },
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    type: 'comment',
    actor: { id: 'user3', displayName: '박지민', profileImage: 'https://picsum.photos/seed/noti3/200' },
    postId: 'post2',
    postImage: 'https://picsum.photos/seed/post2/100',
    comment: '정말 멋진 사진이네요!',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '4',
    type: 'like',
    actor: { id: 'user4', displayName: '최수진', profileImage: 'https://picsum.photos/seed/noti4/200' },
    postId: 'post3',
    postImage: 'https://picsum.photos/seed/post3/100',
    isRead: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

/**
 * NotificationsPage 컴포넌트
 *
 * 알림 목록 페이지
 * - 좋아요, 팔로우, 댓글 알림 표시
 * - 읽음/읽지 않음 상태 표시
 */
function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications] = useState(sampleNotifications);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <FavoriteIcon sx={{ color: 'error.main', fontSize: 16 }} />;
      case 'follow':
        return <PersonAddIcon sx={{ color: 'primary.main', fontSize: 16 }} />;
      case 'comment':
        return <ChatBubbleIcon sx={{ color: 'secondary.main', fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return '님이 회원님의 게시물을 좋아합니다.';
      case 'follow':
        return '님이 회원님을 팔로우하기 시작했습니다.';
      case 'comment':
        return `님이 댓글을 남겼습니다: "${notification.comment}"`;
      default:
        return '';
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === 'follow') {
      navigate(`/profile/${notification.actor.id}`);
    } else if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          p: 2,
          backgroundColor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h2" sx={{ ml: 1 }}>
          알림
        </Typography>
      </Box>

      {/* 알림 목록 */}
      {notifications.length > 0 ? (
        <Box>
          {notifications.map((notification) => (
            <Box
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.5,
                backgroundColor: notification.isRead ? 'transparent' : 'primary.light',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: notification.isRead ? 'background.paper' : 'primary.light',
                },
              }}
            >
              {/* 프로필 이미지 */}
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={notification.actor.profileImage}
                  alt={notification.actor.displayName}
                  sx={{ width: 44, height: 44 }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    backgroundColor: 'background.default',
                    borderRadius: '50%',
                    p: 0.3,
                  }}
                >
                  {getNotificationIcon(notification.type)}
                </Box>
              </Box>

              {/* 알림 내용 */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
                    {notification.actor.displayName}
                  </Typography>
                  {getNotificationText(notification)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatTimeAgo(notification.createdAt)}
                </Typography>
              </Box>

              {/* 게시물 썸네일 */}
              {notification.postImage && (
                <Box
                  component="img"
                  src={notification.postImage}
                  alt="게시물"
                  sx={{
                    width: 44,
                    height: 44,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">아직 알림이 없습니다.</Typography>
        </Box>
      )}
    </Box>
  );
}

export default NotificationsPage;
