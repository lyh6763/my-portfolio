import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

// 샘플 메시지 데이터
const sampleMessages = [
  {
    id: '1',
    senderId: 'user1',
    content: '안녕하세요!',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
  },
  {
    id: '2',
    senderId: 'me',
    content: '안녕하세요~ 반갑습니다!',
    createdAt: new Date(Date.now() - 86300000).toISOString(),
    isRead: true,
  },
  {
    id: '3',
    senderId: 'user1',
    content: '오늘 날씨가 정말 좋네요!',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isRead: true,
  },
  {
    id: '4',
    senderId: 'me',
    content: '네 맞아요! 산책하기 딱 좋은 날씨예요 ☀️',
    createdAt: new Date(Date.now() - 3500000).toISOString(),
    isRead: true,
  },
  {
    id: '5',
    senderId: 'user1',
    content: '안녕하세요! 오늘 날씨 좋네요~',
    createdAt: new Date(Date.now() - 300000).toISOString(),
    isRead: false,
  },
];

const sampleParticipant = {
  id: 'user1',
  displayName: '김철수',
  profileImage: 'https://picsum.photos/seed/msg1/200',
  isOnline: true,
};

/**
 * ChatPage 컴포넌트
 *
 * 채팅 상세 페이지
 * - 메시지 목록
 * - 메시지 입력 및 전송
 */
function ChatPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: newMessage,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const shouldShowDate = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.createdAt).toDateString();
    const prevDate = new Date(prevMsg.createdAt).toDateString();
    return currentDate !== prevDate;
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton onClick={() => navigate('/messages')}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar
            src={sampleParticipant.profileImage}
            alt={sampleParticipant.displayName}
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {sampleParticipant.displayName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {sampleParticipant.isOnline ? '활동 중' : '오프라인'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>알림 설정</MenuItem>
          <MenuItem onClick={handleMenuClose}>차단</MenuItem>
          <MenuItem onClick={handleMenuClose}>신고</MenuItem>
        </Menu>
      </Box>

      {/* 메시지 영역 */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {messages.map((msg, index) => (
          <Box key={msg.id}>
            {/* 날짜 구분선 */}
            {shouldShowDate(msg, messages[index - 1]) && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  my: 2,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    backgroundColor: 'background.paper',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                  }}
                >
                  {formatDate(msg.createdAt)}
                </Typography>
              </Box>
            )}

            {/* 메시지 */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: msg.senderId === 'me' ? 'flex-end' : 'flex-start',
                gap: 1,
              }}
            >
              {msg.senderId !== 'me' && (
                <Avatar
                  src={sampleParticipant.profileImage}
                  alt={sampleParticipant.displayName}
                  sx={{ width: 32, height: 32 }}
                />
              )}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: msg.senderId === 'me' ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    backgroundColor: msg.senderId === 'me' ? 'primary.main' : 'background.paper',
                    color: msg.senderId === 'me' ? 'white' : 'text.primary',
                  }}
                >
                  <Typography variant="body2">{msg.content}</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatTime(msg.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* 입력 영역 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <IconButton>
          <ImageOutlinedIcon />
        </IconButton>
        <TextField
          fullWidth
          size="small"
          placeholder="메시지 입력..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!newMessage.trim()}
          sx={{
            color: newMessage.trim() ? 'primary.main' : 'text.secondary',
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ChatPage;
