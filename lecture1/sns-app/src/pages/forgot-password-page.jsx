import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * ForgotPasswordPage 컴포넌트
 *
 * 비밀번호 찾기/변경 페이지
 * - 아이디, 새 비밀번호, 비밀번호 확인 입력
 * - 변경 완료 시 로그인 페이지로 이동
 */
function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.newPasswordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    // TODO: Supabase 비밀번호 변경 로직 구현
    console.log('비밀번호 변경 시도:', formData);
    alert('비밀번호가 변경되었습니다.');
    navigate('/');
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
          비밀번호 찾기
        </Typography>
      </Box>

      {/* 폼 영역 */}
      <Container maxWidth="xs" sx={{ flex: 1, py: 4 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}
        >
          아이디를 입력하고 새 비밀번호를 설정하세요.
        </Typography>

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
            name="username"
            placeholder="아이디"
            value={formData.username}
            onChange={handleChange}
            size="small"
            required
          />
          <TextField
            fullWidth
            name="newPassword"
            type="password"
            placeholder="새 비밀번호"
            value={formData.newPassword}
            onChange={handleChange}
            size="small"
            required
          />
          <TextField
            fullWidth
            name="newPasswordConfirm"
            type="password"
            placeholder="새 비밀번호 확인"
            value={formData.newPasswordConfirm}
            onChange={handleChange}
            size="small"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            비밀번호 변경
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ForgotPasswordPage;
