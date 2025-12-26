import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PublishIcon from '@mui/icons-material/Publish';
import Navbar from '../components/common/Navbar';
import { createPost, logoutUser } from '../utils/storage';

/**
 * CreatePostPage 컴포넌트
 *
 * Props:
 * @param {object} user - 현재 로그인된 사용자 정보 [Required]
 * @param {function} onLogout - 로그아웃 시 호출되는 함수 [Required]
 *
 * Example usage:
 * <CreatePostPage user={currentUser} onLogout={handleLogout} />
 */
function CreatePostPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    await createPost({
      title: title.trim(),
      content: content.trim(),
      authorId: user?.id,
    });

    navigate('/');
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
          취소
        </Button>

        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ p: { xs: 2, md: 3 } }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 600,
                color: 'text.primary',
                mb: 3,
              }}
            >
              새 글 작성
            </Typography>

            <TextField
              fullWidth
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              sx={{ mb: 3 }}
              inputProps={{ maxLength: 100 }}
            />

            <TextField
              fullWidth
              label="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              multiline
              rows={12}
              sx={{ mb: 3 }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'text.secondary',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<PublishIcon />}
                disabled={!title.trim() || !content.trim() || isSubmitting}
              >
                {isSubmitting ? '업로드 중...' : '게시물 업로드'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default CreatePostPage;
