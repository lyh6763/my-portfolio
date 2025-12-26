import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import SendIcon from '@mui/icons-material/Send';
import Navbar from '../components/common/Navbar';
import { getPostById, toggleLike, addComment, logoutUser } from '../utils/storage';

/**
 * PostDetailPage 컴포넌트
 *
 * Props:
 * @param {object} user - 현재 로그인된 사용자 정보 [Required]
 * @param {function} onLogout - 로그아웃 시 호출되는 함수 [Required]
 *
 * Example usage:
 * <PostDetailPage user={currentUser} onLogout={handleLogout} />
 */
function PostDetailPage({ user, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      const loadedPost = await getPostById(id);
      if (loadedPost) {
        setPost(loadedPost);
        setIsLiked(loadedPost.likedBy.includes(user?.id));
      }
      setIsLoading(false);
    };
    loadPost();
  }, [id, user?.id]);

  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleLikeClick = async () => {
    const updatedPost = await toggleLike(id, user?.id);
    if (updatedPost) {
      setPost(updatedPost);
      setIsLiked(updatedPost.likedBy.includes(user?.id));
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const updatedPost = await addComment(id, {
      content: commentContent,
      authorId: user?.id,
    });

    if (updatedPost) {
      setPost(updatedPost);
      setCommentContent('');
    }
    setIsSubmitting(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar user={user} onLogout={handleLogout} />
        <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            게시물을 불러오는 중...
          </Typography>
        </Container>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar user={user} onLogout={handleLogout} />
        <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            게시물을 찾을 수 없습니다.
          </Typography>
          <Button
            variant="contained"
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            목록으로 돌아가기
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} onLogout={handleLogout} />

      <Container
        maxWidth="md"
        sx={{
          py: { xs: 2, md: 4 },
          px: { xs: 2, md: 3 },
          flex: 1,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            mb: 2,
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'transparent',
            },
          }}
        >
          목록으로
        </Button>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
            mb: 3,
          }}
        >
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 600,
                color: 'text.primary',
                mb: 1.5,
              }}
            >
              {post.title}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: 'primary.main', fontWeight: 500 }}
              >
                {post.author}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {formatDate(post.createdAt)}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography
              variant="body1"
              sx={{
                color: 'text.primary',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                minHeight: 100,
              }}
            >
              {post.content}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={handleLikeClick}
                sx={{
                  color: isLiked ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'rgba(168, 212, 245, 0.08)',
                  },
                }}
              >
                {isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
              </IconButton>
              <Typography
                variant="body2"
                sx={{
                  color: isLiked ? 'primary.main' : 'text.secondary',
                  fontWeight: 500,
                }}
              >
                좋아요 {post.likes}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 600,
                color: 'text.primary',
                mb: 2,
              }}
            >
              댓글 {post.comments.length}
            </Typography>

            <Box
              component="form"
              onSubmit={handleCommentSubmit}
              sx={{
                display: 'flex',
                gap: 1,
                mb: post.comments.length > 0 ? 3 : 0,
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="댓글을 입력하세요"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.default',
                  },
                }}
              />
              <IconButton
                type="submit"
                color="primary"
                disabled={!commentContent.trim() || isSubmitting}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'background.paper',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'action.disabledBackground',
                    color: 'action.disabled',
                  },
                }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>

            {post.comments.length > 0 && (
              <List disablePadding>
                {post.comments.map((comment, index) => (
                  <Box key={comment.id}>
                    {index > 0 && <Divider sx={{ my: 1.5 }} />}
                    <ListItem disablePadding sx={{ display: 'block' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: 'primary.main', fontWeight: 500 }}
                        >
                          {comment.author}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {formatDate(comment.createdAt)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.primary', lineHeight: 1.6 }}
                      >
                        {comment.content}
                      </Typography>
                    </ListItem>
                  </Box>
                ))}
              </List>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default PostDetailPage;
