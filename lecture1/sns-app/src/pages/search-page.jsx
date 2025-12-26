import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import BottomNav from '../components/common/bottom-nav';

// 샘플 데이터
const samplePosts = Array.from({ length: 12 }, (_, i) => ({
  id: `post${i + 1}`,
  image: `https://picsum.photos/seed/search${i + 1}/300`,
}));

const sampleUsers = [
  { id: 'user1', displayName: '김철수', username: 'chulsoo', profileImage: 'https://picsum.photos/seed/suser1/200', followersCount: 1234 },
  { id: 'user2', displayName: '이영희', username: 'younghee', profileImage: 'https://picsum.photos/seed/suser2/200', followersCount: 5678 },
  { id: 'user3', displayName: '박지민', username: 'jimin', profileImage: 'https://picsum.photos/seed/suser3/200', followersCount: 9012 },
];

const sampleHashtags = [
  { name: '여행', postsCount: 123456 },
  { name: '맛집', postsCount: 98765 },
  { name: '일상', postsCount: 456789 },
  { name: '오늘의룩', postsCount: 34567 },
];

/**
 * SearchPage 컴포넌트
 *
 * 검색 페이지
 * - 검색 전: 추천 피드 그리드
 * - 검색 후: 유저/게시물/해시태그 탭
 */
function SearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  const handleCancelSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

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
      {/* 검색 헤더 */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'background.default',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleSearchFocus}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {isSearching && (
          <Button
            onClick={handleCancelSearch}
            sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
          >
            취소
          </Button>
        )}
      </Box>

      {/* 검색 결과 또는 추천 피드 */}
      {isSearching && searchQuery ? (
        <Box>
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
            <Tab label="유저" />
            <Tab label="게시물" />
            <Tab label="해시태그" />
          </Tabs>

          {/* 유저 탭 */}
          {tabValue === 0 && (
            <Box sx={{ p: 2 }}>
              {sampleUsers.map((user) => (
                <Box
                  key={user.id}
                  onClick={() => navigate(`/profile/${user.id}`)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.5,
                    cursor: 'pointer',
                  }}
                >
                  <Avatar
                    src={user.profileImage}
                    alt={user.displayName}
                    sx={{ width: 44, height: 44 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user.username}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {user.displayName} • 팔로워 {formatCount(user.followersCount)}명
                    </Typography>
                  </Box>
                  <Button variant="outlined" size="small">
                    팔로우
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          {/* 게시물 탭 */}
          {tabValue === 1 && (
            <Grid container spacing={0.5} sx={{ p: 0.5 }}>
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

          {/* 해시태그 탭 */}
          {tabValue === 2 && (
            <Box sx={{ p: 2 }}>
              {sampleHashtags.map((tag) => (
                <Box
                  key={tag.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.5,
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h2">#</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      #{tag.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      게시물 {formatCount(tag.postsCount)}개
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ) : (
        /* 추천 피드 그리드 */
        <Grid container spacing={0.5} sx={{ p: 0.5 }}>
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

      <BottomNav />
    </Box>
  );
}

export default SearchPage;
