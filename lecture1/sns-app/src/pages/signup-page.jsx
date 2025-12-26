import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../hooks/use-auth';

/**
 * SignupPage 컴포넌트
 *
 * 회원가입 페이지
 * - 유저 이름, 아이디, 비밀번호, 비밀번호 확인 입력
 * - 회원가입 완료 시 로그인 페이지로 이동
 */
function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    password: '',
    passwordConfirm: '',
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

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    setError('');

    const result = await signup({
      displayName: formData.displayName,
      username: formData.username,
      password: formData.password,
    });

    if (result.success) {
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/');
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
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h2" sx={{ ml: 1 }}>
          회원가입
        </Typography>
      </Box>

      {/* 폼 영역 */}
      <Container maxWidth="xs" sx={{ flex: 1, py: 4 }}>
        {/* 에러 메시지 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            name="displayName"
            placeholder="이름"
            value={formData.displayName}
            onChange={handleChange}
            size="small"
            required
            disabled={loading}
          />
          <TextField
            fullWidth
            name="username"
            placeholder="아이디"
            value={formData.username}
            onChange={handleChange}
            size="small"
            required
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
            required
            disabled={loading}
          />
          <TextField
            fullWidth
            name="passwordConfirm"
            type="password"
            placeholder="비밀번호 확인"
            value={formData.passwordConfirm}
            onChange={handleChange}
            size="small"
            required
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading || !formData.displayName || !formData.username || !formData.password}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : '회원가입 완료'}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            이미 계정이 있으신가요?{' '}
            <Link to="/">
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'primary.main', fontWeight: 600 }}
              >
                로그인
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default SignupPage;
