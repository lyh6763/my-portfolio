import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

// 샘플 게시물 데이터
const samplePost = {
  id: '1',
  user: {
    id: 'user1',
    displayName: '김철수',
    profileImage: 'https://picsum.photos/seed/user1/200',
  },
  images: [
    'https://picsum.photos/seed/post1-1/600',
    'https://picsum.photos/seed/post1-2/600',
  ],
  caption: '오늘 날씨가 정말 좋네요! 🌞 산책하기 딱 좋은 날씨입니다. 여러분도 밖에 나가서 좋은 공기 마시세요~ #일상 #날씨 #산책',
  likesCount: 128,
  location: '서울 강남구',
  createdAt: new Date(Date.now() - 3600000).toISOString(),
};

const sampleComments = [
  {
    id: 'c1',
    user: { id: 'user2', displayName: '이영희', profileImage: 'https://picsum.photos/seed/cuser1/200' },
    content: '정말 좋은 사진이네요!',
    likesCount: 5,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    replies: [
      {
        id: 'r1',
        user: { id: 'user1', displayName: '김철수', profileImage: 'https://picsum.photos/seed/user1/200' },
        content: '감사합니다! 😊',
        likesCount: 2,
        createdAt: new Date(Date.now() - 900000).toISOString(),
      },
    ],
  },
  {
    id: 'c2',
    user: { id: 'user3', displayName: '박지민', profileImage: 'https://picsum.photos/seed/cuser2/200' },
    content: '저도 오늘 산책 다녀왔어요~',
    likesCount: 3,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    replies: [],
  },
];

/**
 * PostDetailPage 컴포넌트
 *
 * 게시물 상세 페이지
 * - 게시물 내용
 * - 댓글 목록
 * - 댓글 입력
 */
function PostDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(sampleComments);
  const [expandedReplies, setExpandedReplies] = useState({});

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      user: { id: 'me', displayName: '나', profileImage: 'https://picsum.photos/seed/me/200' },
      content: newComment,
      likesCount: 0,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
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
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h2">게시물</Typography>
        <IconButton onClick={handleMenuOpen}>
          <MoreHorizIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>수정</MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>삭제</MenuItem>
        </Menu>
      </Box>

      {/* 프로필 영역 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1.5,
        }}
      >
        <Avatar
          src={samplePost.user.profileImage}
          alt={samplePost.user.displayName}
          sx={{ width: 44, height: 44, cursor: 'pointer' }}
          onClick={() => navigate(`/profile/${samplePost.user.id}`)}
        />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {samplePost.user.displayName}
          </Typography>
          {samplePost.location && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {samplePost.location}
            </Typography>
          )}
        </Box>
      </Box>

      {/* 이미지 영역 */}
      <Box sx={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
        <Box
          component="img"
          src={samplePost.images[currentImageIndex]}
          alt={`게시물 이미지 ${currentImageIndex + 1}`}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {samplePost.images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 0.5,
            }}
          >
            {samplePost.images.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: index === currentImageIndex ? 'primary.main' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* 리액션 영역 */}
      <Box sx={{ px: 2, pt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => setIsLiked(!isLiked)} sx={{ p: 0.5 }}>
              {isLiked ? <FavoriteIcon sx={{ color: 'error.main' }} /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton onClick={() => setCommentDrawerOpen(true)} sx={{ p: 0.5 }}>
              <ChatBubbleOutlineIcon />
            </IconButton>
            <IconButton sx={{ p: 0.5 }}>
              <SendOutlinedIcon />
            </IconButton>
          </Box>
          <IconButton onClick={() => setIsSaved(!isSaved)} sx={{ p: 0.5 }}>
            {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
          좋아요 {samplePost.likesCount.toLocaleString()}개
        </Typography>

        {/* 캡션 */}
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="body2" component="span" sx={{ fontWeight: 600, mr: 0.5 }}>
            {samplePost.user.displayName}
          </Typography>
          <Typography variant="body2" component="span">
            {samplePost.caption}
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
          {formatTimeAgo(samplePost.createdAt)}
        </Typography>
      </Box>

      {/* 댓글 영역 */}
      <Box sx={{ px: 2, py: 2, borderTop: '1px solid', borderColor: 'divider', mt: 2 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', mb: 2, cursor: 'pointer' }}
          onClick={() => setCommentDrawerOpen(true)}
        >
          댓글 {comments.length}개 모두 보기
        </Typography>

        {/* 댓글 미리보기 */}
        {comments.slice(0, 2).map((comment) => (
          <Box key={comment.id} sx={{ mb: 1 }}>
            <Typography variant="body2">
              <Typography component="span" sx={{ fontWeight: 600, mr: 0.5 }}>
                {comment.user.displayName}
              </Typography>
              {comment.content}
            </Typography>
          </Box>
        ))}

        {/* 댓글 입력 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Avatar sx={{ width: 32, height: 32 }} />
          <TextField
            fullWidth
            size="small"
            placeholder="댓글 달기..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          <Typography
            variant="body2"
            sx={{
              color: newComment.trim() ? 'primary.main' : 'text.secondary',
              fontWeight: 600,
              cursor: newComment.trim() ? 'pointer' : 'default',
            }}
            onClick={handleAddComment}
          >
            게시
          </Typography>
        </Box>
      </Box>

      {/* 댓글 바텀시트 */}
      <Drawer
        anchor="bottom"
        open={commentDrawerOpen}
        onClose={() => setCommentDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '80vh',
          },
        }}
      >
        {/* 드래그 바 */}
        <Box
          sx={{
            width: 40,
            height: 4,
            backgroundColor: 'divider',
            borderRadius: 2,
            mx: 'auto',
            mt: 1,
            mb: 2,
          }}
        />

        <Typography variant="h2" sx={{ textAlign: 'center', mb: 2 }}>
          댓글
        </Typography>

        {/* 댓글 목록 */}
        <Box sx={{ flex: 1, overflow: 'auto', px: 2, pb: 2 }}>
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Avatar
                  src={comment.user.profileImage}
                  alt={comment.user.displayName}
                  sx={{ width: 32, height: 32 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {comment.user.displayName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {formatTimeAgo(comment.createdAt)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {comment.content}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer' }}>
                      좋아요 {comment.likesCount}개
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer' }}>
                      답글 달기
                    </Typography>
                  </Box>

                  {/* 답글 */}
                  {comment.replies.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', cursor: 'pointer' }}
                        onClick={() => toggleReplies(comment.id)}
                      >
                        {expandedReplies[comment.id] ? '답글 숨기기' : `답글 ${comment.replies.length}개 보기`}
                      </Typography>
                      {expandedReplies[comment.id] && (
                        <Box sx={{ mt: 1 }}>
                          {comment.replies.map((reply) => (
                            <Box key={reply.id} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Avatar
                                src={reply.user.profileImage}
                                alt={reply.user.displayName}
                                sx={{ width: 24, height: 24 }}
                              />
                              <Box>
                                <Typography variant="body2">
                                  <Typography component="span" sx={{ fontWeight: 600, mr: 0.5 }}>
                                    {reply.user.displayName}
                                  </Typography>
                                  {reply.content}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {formatTimeAgo(reply.createdAt)}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
                <IconButton size="small">
                  <FavoriteBorderIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>

        {/* 댓글 입력 */}
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
          <Avatar sx={{ width: 32, height: 32 }} />
          <TextField
            fullWidth
            size="small"
            placeholder="댓글 달기..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Typography
            variant="body2"
            sx={{
              color: newComment.trim() ? 'primary.main' : 'text.secondary',
              fontWeight: 600,
              cursor: newComment.trim() ? 'pointer' : 'default',
            }}
            onClick={handleAddComment}
          >
            게시
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
}

export default PostDetailPage;
