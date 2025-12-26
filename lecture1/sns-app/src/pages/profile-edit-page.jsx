import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * ProfileEditPage 컴포넌트
 *
 * 프로필 편집 페이지
 * - 프로필 이미지 변경
 * - 이름, 사용자 이름, 자기소개, 링크 수정
 */
function ProfileEditPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: '나',
    username: 'myusername',
    bio: '안녕하세요! 일상을 공유하는 계정입니다. 🌟\n여행과 맛집을 좋아해요.',
    link: 'https://example.com',
    profileImage: 'https://picsum.photos/seed/myprofile/200',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = () => {
    // TODO: 이미지 업로드 로직 구현
    alert('이미지 변경 기능은 추후 구현됩니다.');
  };

  const handleSubmit = () => {
    // TODO: Supabase 프로필 업데이트 로직 구현
    console.log('프로필 업데이트:', formData);
    alert('프로필이 업데이트되었습니다.');
    navigate('/profile');
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h2" sx={{ ml: 1 }}>
            프로필 편집
          </Typography>
        </Box>
        <Button
          onClick={handleSubmit}
          sx={{ fontWeight: 600 }}
        >
          완료
        </Button>
      </Box>

      {/* 프로필 이미지 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
        }}
      >
        <Avatar
          src={formData.profileImage}
          alt={formData.displayName}
          sx={{ width: 88, height: 88 }}
        />
        <Button
          onClick={handleImageChange}
          sx={{ mt: 1, color: 'primary.main' }}
        >
          사진 변경
        </Button>
      </Box>

      {/* 폼 */}
      <Box sx={{ px: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            이름
          </Typography>
          <TextField
            fullWidth
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            variant="standard"
            sx={{ mt: 0.5 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            사용자 이름
          </Typography>
          <TextField
            fullWidth
            name="username"
            value={formData.username}
            onChange={handleChange}
            variant="standard"
            sx={{ mt: 0.5 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            소개
          </Typography>
          <TextField
            fullWidth
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            variant="standard"
            multiline
            rows={3}
            sx={{ mt: 0.5 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            링크
          </Typography>
          <TextField
            fullWidth
            name="link"
            value={formData.link}
            onChange={handleChange}
            variant="standard"
            sx={{ mt: 0.5 }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ProfileEditPage;
