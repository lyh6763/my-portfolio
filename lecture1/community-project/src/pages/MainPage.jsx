import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Navbar from '../components/common/Navbar';
import { getPosts, logoutUser } from '../utils/storage';

/**
 * MainPage 컴포넌트
 *
 * Props:
 * @param {object} user - 현재 로그인된 사용자 정보 [Required]
 * @param {function} onLogout - 로그아웃 시 호출되는 함수 [Required]
 *
 * Example usage:
 * <MainPage user={currentUser} onLogout={handleLogout} />
 */
function MainPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      const loadedPosts = await getPosts();
      setPosts(loadedPosts);
      setIsLoading(false);
    };
    loadPosts();
  }, []);

  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
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
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 600,
            mb: 2,
            color: 'text.primary',
          }}
        >
          게시물 목록
        </Typography>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {isLoading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                게시물을 불러오는 중...
              </Typography>
            </Box>
          ) : posts.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                아직 게시물이 없습니다. 첫 번째 글을 작성해보세요!
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {posts.map((post, index) => (
                <Box key={post.id}>
                  {index > 0 && <Divider />}
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handlePostClick(post.id)}
                      sx={{
                        py: { xs: 2, md: 2.5 },
                        px: { xs: 2, md: 3 },
                        '&:hover': {
                          backgroundColor: 'rgba(168, 212, 245, 0.08)',
                        },
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Typography
                          variant="h3"
                          sx={{
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            fontWeight: 500,
                            color: 'text.primary',
                            mb: 1,
                          }}
                        >
                          {post.title}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: { xs: 1, md: 2 },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', fontWeight: 500 }}
                          >
                            {post.author}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {formatDate(post.createdAt)}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Chip
                              icon={<ThumbUpIcon sx={{ fontSize: '14px !important' }} />}
                              label={post.likes}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: 'divider',
                                color: 'text.secondary',
                                '& .MuiChip-icon': {
                                  color: 'primary.main',
                                },
                              }}
                            />
                            <Chip
                              icon={<ChatBubbleOutlineIcon sx={{ fontSize: '14px !important' }} />}
                              label={post.commentsCount}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: 'divider',
                                color: 'text.secondary',
                                '& .MuiChip-icon': {
                                  color: 'secondary.main',
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default MainPage;
