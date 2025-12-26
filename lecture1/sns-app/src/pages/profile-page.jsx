import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import GridOnIcon from '@mui/icons-material/GridOn';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BottomNav from '../components/common/bottom-nav';

// 샘플 프로필 데이터
const sampleProfile = {
  id: 'me',
  displayName: '나',
  username: 'myusername',
  profileImage: 'https://picsum.photos/seed/myprofile/200',
  bio: '안녕하세요! 일상을 공유하는 계정입니다. 🌟\n여행과 맛집을 좋아해요.',
  link: 'https://example.com',
  postsCount: 42,
  followersCount: 1234,
  followingCount: 567,
  isPrivate: false,
};

// 샘플 게시물 데이터
const samplePosts = Array.from({ length: 9 }, (_, i) => ({
  id: `mypost${i + 1}`,
  image: `https://picsum.photos/seed/mypost${i + 1}/300`,
}));

const sampleSavedPosts = Array.from({ length: 6 }, (_, i) => ({
  id: `saved${i + 1}`,
  image: `https://picsum.photos/seed/saved${i + 1}/300`,
}));

/**
 * ProfilePage 컴포넌트
 *
 * 프로필 페이지
 * - 프로필 정보
 * - 게시물 그리드
 * - 저장된 게시물 (본인만)
 */
function ProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  // 본인 프로필인지 확인 (실제로는 로그인 상태와 비교)
  const isMyProfile = !id || id === 'me';
  const profile = sampleProfile;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        pb: '60px',
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
        <Typography variant="h2">{profile.username}</Typography>
        {isMyProfile && (
          <IconButton onClick={() => navigate('/settings')}>
            <SettingsOutlinedIcon />
          </IconButton>
        )}
      </Box>

      {/* 프로필 정보 */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* 프로필 이미지 */}
          <Avatar
            src={profile.profileImage}
            alt={profile.displayName}
            sx={{ width: 88, height: 88 }}
          />

          {/* 통계 */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {profile.postsCount}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                게시물
              </Typography>
            </Box>
            <Box
              sx={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/followers')}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {formatCount(profile.followersCount)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                팔로워
              </Typography>
            </Box>
            <Box
              sx={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/following')}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {formatCount(profile.followingCount)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                팔로잉
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 이름 & 소개 */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {profile.displayName}
          </Typography>
          <Typography
            variant="body2"
            sx={{ whiteSpace: 'pre-line', mt: 0.5 }}
          >
            {profile.bio}
          </Typography>
          {profile.link && (
            <Typography
              variant="body2"
              sx={{ color: 'primary.main', mt: 0.5 }}
              component="a"
              href={profile.link}
              target="_blank"
            >
              {profile.link}
            </Typography>
          )}
        </Box>

        {/* 버튼 영역 */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          {isMyProfile ? (
            <>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/profile/edit')}
                sx={{ borderColor: 'divider', color: 'text.primary' }}
              >
                프로필 편집
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{ borderColor: 'divider', color: 'text.primary' }}
              >
                프로필 공유
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={isFollowing ? 'outlined' : 'contained'}
                fullWidth
                onClick={() => setIsFollowing(!isFollowing)}
                sx={isFollowing ? { borderColor: 'divider', color: 'text.primary' } : {}}
              >
                {isFollowing ? '팔로잉' : '팔로우'}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/messages/new')}
                sx={{ borderColor: 'divider', color: 'text.primary' }}
              >
                메시지
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* 탭 */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Tab icon={<GridOnIcon />} aria-label="게시물" />
        {isMyProfile && <Tab icon={<BookmarkBorderIcon />} aria-label="저장됨" />}
      </Tabs>

      {/* 게시물 그리드 */}
      {tabValue === 0 && (
        <Grid container spacing={0.5}>
          {samplePosts.map((post) => (
            <Grid key={post.id} size={{ xs: 4 }}>
              <Box
                onClick={() => navigate(`/post/${post.id}`)}
                sx={{
                  position: 'relative',
                  paddingTop: '100%',
                  cursor: 'pointer',
                }}
              >
                <Box
                  component="img"
                  src={post.image}
                  alt="게시물"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 저장된 게시물 그리드 */}
      {tabValue === 1 && isMyProfile && (
        <Grid container spacing={0.5}>
          {sampleSavedPosts.length > 0 ? (
            sampleSavedPosts.map((post) => (
              <Grid key={post.id} size={{ xs: 4 }}>
                <Box
                  onClick={() => navigate(`/post/${post.id}`)}
                  sx={{
                    position: 'relative',
                    paddingTop: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    component="img"
                    src={post.image}
                    alt="저장된 게시물"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </Grid>
            ))
          ) : (
            <Box
              sx={{
                width: '100%',
                py: 8,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <BookmarkBorderIcon sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="body1">저장된 게시물이 없습니다.</Typography>
            </Box>
          )}
        </Grid>
      )}

      <BottomNav />
    </Box>
  );
}

export default ProfilePage;
