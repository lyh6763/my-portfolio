import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useAuth } from '../hooks/use-auth';

/**
 * LoginPage 컴포넌트
 *
 * 사용자 로그인을 처리하는 페이지
 * - 아이디/비밀번호 입력
 * - 로그인 버튼
 * - 비밀번호 찾기 / 회원가입 링크
 */
function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);

    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.default',
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {/* 로고 영역 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
            }}
          >
            <InstagramIcon
              sx={{
                fontSize: 48,
                background: 'linear-gradient(45deg, #E1306C 30%, #833AB4 90%)',
                borderRadius: '12px',
                color: 'white',
                p: 1,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                background: 'linear-gradient(45deg, #E1306C 30%, #833AB4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              SNS App
            </Typography>
          </Box>

          {/* 에러 메시지 */}
          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          {/* 로그인 폼 */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              name="username"
              placeholder="아이디"
              value={formData.username}
              onChange={handleChange}
              size="small"
              disabled={loading}
            />
            <TextField
              fullWidth
              name="password"
              type="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              size="small"
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 1 }}
              disabled={loading || !formData.username || !formData.password}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
            </Button>
          </Box>

          {/* 하단 링크 */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 2,
            }}
          >
            <Link to="/forgot-password">
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              >
                비밀번호 찾기
              </Typography>
            </Link>
            <Typography variant="body2" sx={{ color: 'divider' }}>
              |
            </Typography>
            <Link to="/signup">
              <Typography
                variant="body2"
                sx={{ color: 'primary.main', fontWeight: 600 }}
              >
                회원가입
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;
