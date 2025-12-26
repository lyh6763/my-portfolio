import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchIcon from '@mui/icons-material/Search';

// 샘플 대화 데이터
const sampleConversations = [
  {
    id: 'conv1',
    participant: {
      id: 'user1',
      displayName: '김철수',
      profileImage: 'https://picsum.photos/seed/msg1/200',
      isOnline: true,
    },
    lastMessage: '안녕하세요! 오늘 날씨 좋네요~',
    lastMessageTime: new Date(Date.now() - 300000).toISOString(),
    unreadCount: 2,
    isPinned: true,
  },
  {
    id: 'conv2',
    participant: {
      id: 'user2',
      displayName: '이영희',
      profileImage: 'https://picsum.photos/seed/msg2/200',
      isOnline: false,
    },
    lastMessage: '사진 잘 봤어요!',
    lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: 'conv3',
    participant: {
      id: 'user3',
      displayName: '박지민',
      profileImage: 'https://picsum.photos/seed/msg3/200',
      isOnline: true,
    },
    lastMessage: '다음에 같이 밥 먹어요 ㅎㅎ',
    lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 5,
    isPinned: false,
  },
];

/**
 * MessagesPage 컴포넌트
 *
 * 메시지 대화 목록 페이지
 * - 대화 목록
 * - 온라인 상태 표시
 * - 읽지 않은 메시지 수 표시
 */
function MessagesPage() {
  const navigate = useNavigate();
  const [conversations] = useState(sampleConversations);
  const [searchQuery, setSearchQuery] = useState('');

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일`;
    return date.toLocaleDateString('ko-KR');
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          backgroundColor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate('/home')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h2" sx={{ ml: 1 }}>
              메시지
            </Typography>
          </Box>
          <IconButton>
            <EditOutlinedIcon />
          </IconButton>
        </Box>

        {/* 검색 */}
        <Box sx={{ px: 2, pb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* 대화 목록 */}
      {filteredConversations.length > 0 ? (
        <Box>
          {filteredConversations.map((conv) => (
            <Box
              key={conv.id}
              onClick={() => navigate(`/messages/${conv.id}`)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.5,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'background.paper',
                },
              }}
            >
              {/* 프로필 이미지 + 온라인 표시 */}
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: conv.participant.isOnline ? 'success.main' : 'transparent',
                    border: conv.participant.isOnline ? '2px solid white' : 'none',
                  },
                }}
              >
                <Avatar
                  src={conv.participant.profileImage}
                  alt={conv.participant.displayName}
                  sx={{ width: 56, height: 56 }}
                />
              </Badge>

              {/* 대화 정보 */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: conv.unreadCount > 0 ? 600 : 400,
                    }}
                  >
                    {conv.participant.displayName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formatTimeAgo(conv.lastMessageTime)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: conv.unreadCount > 0 ? 'text.primary' : 'text.secondary',
                      fontWeight: conv.unreadCount > 0 ? 500 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '80%',
                    }}
                  >
                    {conv.lastMessage}
                  </Typography>
                  {conv.unreadCount > 0 && (
                    <Box
                      sx={{
                        minWidth: 20,
                        height: 20,
                        borderRadius: '10px',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 600,
                        px: 0.5,
                      }}
                    >
                      {conv.unreadCount}
                    </Box>
                  )}
                </Box>
              </Box>
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
          <Typography variant="body1">
            {searchQuery ? '검색 결과가 없습니다.' : '아직 메시지가 없습니다.'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default MessagesPage;
