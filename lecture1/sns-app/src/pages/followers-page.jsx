import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';

// 샘플 데이터
const sampleFollowers = [
  { id: 'user1', displayName: '김철수', username: 'chulsoo', profileImage: 'https://picsum.photos/seed/fuser1/200', isFollowing: true },
  { id: 'user2', displayName: '이영희', username: 'younghee', profileImage: 'https://picsum.photos/seed/fuser2/200', isFollowing: false },
  { id: 'user3', displayName: '박지민', username: 'jimin', profileImage: 'https://picsum.photos/seed/fuser3/200', isFollowing: true },
  { id: 'user4', displayName: '최수진', username: 'sujin', profileImage: 'https://picsum.photos/seed/fuser4/200', isFollowing: false },
];

const sampleFollowing = [
  { id: 'user1', displayName: '김철수', username: 'chulsoo', profileImage: 'https://picsum.photos/seed/fuser1/200', isFollowing: true },
  { id: 'user5', displayName: '정민준', username: 'minjun', profileImage: 'https://picsum.photos/seed/fuser5/200', isFollowing: true },
  { id: 'user6', displayName: '한서연', username: 'seoyeon', profileImage: 'https://picsum.photos/seed/fuser6/200', isFollowing: true },
];

/**
 * FollowersPage 컴포넌트
 *
 * 팔로워/팔로잉 목록 페이지
 * - 탭으로 팔로워/팔로잉 전환
 * - 검색 기능
 * - 팔로우/언팔로우 버튼
 */
function FollowersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFollowingTab = location.pathname === '/following';

  const [tabValue, setTabValue] = useState(isFollowingTab ? 1 : 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [followers, setFollowers] = useState(sampleFollowers);
  const [following, setFollowing] = useState(sampleFollowing);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    navigate(newValue === 0 ? '/followers' : '/following', { replace: true });
  };

  const handleFollowToggle = (userId, isCurrentlyFollowing, listType) => {
    if (listType === 'followers') {
      setFollowers(followers.map((user) =>
        user.id === userId ? { ...user, isFollowing: !isCurrentlyFollowing } : user
      ));
    } else {
      setFollowing(following.map((user) =>
        user.id === userId ? { ...user, isFollowing: !isCurrentlyFollowing } : user
      ));
    }
  };

  const currentList = tabValue === 0 ? followers : following;
  const filteredList = currentList.filter((user) =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          backgroundColor: 'background.default',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
          }}
        >
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h2" sx={{ ml: 1 }}>
            myusername
          </Typography>
        </Box>

        {/* 탭 */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tab label={`팔로워 ${followers.length}`} />
          <Tab label={`팔로잉 ${following.length}`} />
        </Tabs>

        {/* 검색 */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* 유저 목록 */}
      {filteredList.length > 0 ? (
        <Box>
          {filteredList.map((user) => (
            <Box
              key={user.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.5,
              }}
            >
              <Avatar
                src={user.profileImage}
                alt={user.displayName}
                sx={{ width: 44, height: 44, cursor: 'pointer' }}
                onClick={() => navigate(`/profile/${user.id}`)}
              />
              <Box
                sx={{ flex: 1, cursor: 'pointer' }}
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user.username}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {user.displayName}
                </Typography>
              </Box>
              <Button
                variant={user.isFollowing ? 'outlined' : 'contained'}
                size="small"
                onClick={() => handleFollowToggle(user.id, user.isFollowing, tabValue === 0 ? 'followers' : 'following')}
                sx={
                  user.isFollowing
                    ? { borderColor: 'divider', color: 'text.primary', minWidth: 80 }
                    : { minWidth: 80 }
                }
              >
                {user.isFollowing ? '팔로잉' : '팔로우'}
              </Button>
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40vh',
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">
            {searchQuery
              ? '검색 결과가 없습니다.'
              : tabValue === 0
              ? '아직 팔로워가 없습니다.'
              : '아직 팔로잉하는 사람이 없습니다.'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default FollowersPage;
