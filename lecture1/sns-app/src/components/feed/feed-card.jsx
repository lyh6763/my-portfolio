import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

/**
 * FeedCard 컴포넌트
 *
 * 피드(게시물) 카드
 * Props:
 * @param {object} post - 게시물 데이터 [Required]
 * @param {string} post.id - 게시물 ID
 * @param {object} post.user - 작성자 정보
 * @param {string[]} post.images - 이미지 URL 배열
 * @param {string} post.caption - 게시물 내용
 * @param {number} post.likesCount - 좋아요 수
 * @param {number} post.commentsCount - 댓글 수
 * @param {string} post.location - 위치
 * @param {string} post.createdAt - 작성 시간
 *
 * Example usage:
 * <FeedCard post={postData} />
 */
function FeedCard({ post }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showFullCaption, setShowFullCaption] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* 프로필 영역 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/profile/${post.user.id}`)}
        >
          <Avatar
            src={post.user.profileImage}
            alt={post.user.displayName}
            sx={{ width: 44, height: 44 }}
          />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {post.user.displayName}
            </Typography>
            {post.location && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {post.location}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton onClick={handleMenuOpen}>
          <MoreHorizIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { handleMenuClose(); navigate(`/profile/${post.user.id}`); }}>
            프로필 보기
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>신고</MenuItem>
          <MenuItem onClick={handleMenuClose}>차단</MenuItem>
        </Menu>
      </Box>

      {/* 이미지 영역 */}
      <Box sx={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
        <Box
          component="img"
          src={post.images[currentImageIndex]}
          alt={`게시물 이미지 ${currentImageIndex + 1}`}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* 이미지 인디케이터 */}
        {post.images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 0.5,
            }}
          >
            {post.images.map((_, index) => (
              <Box
                key={index}
                onClick={() => handleImageChange(index)}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: index === currentImageIndex ? 'primary.main' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* 리액션 영역 */}
      <Box sx={{ px: 2, pt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => setIsLiked(!isLiked)}
              sx={{ p: 0.5 }}
            >
              {isLiked ? (
                <FavoriteIcon sx={{ color: 'error.main' }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <IconButton
              onClick={() => navigate(`/post/${post.id}`)}
              sx={{ p: 0.5 }}
            >
              <ChatBubbleOutlineIcon />
            </IconButton>
            <IconButton sx={{ p: 0.5 }}>
              <SendOutlinedIcon />
            </IconButton>
          </Box>
          <IconButton
            onClick={() => setIsSaved(!isSaved)}
            sx={{ p: 0.5 }}
          >
            {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </Box>

        {/* 좋아요 수 */}
        <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
          좋아요 {post.likesCount.toLocaleString()}개
        </Typography>

        {/* 캡션 */}
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="body2" component="span" sx={{ fontWeight: 600, mr: 0.5 }}>
            {post.user.displayName}
          </Typography>
          <Typography variant="body2" component="span">
            {showFullCaption || post.caption.length <= 100
              ? post.caption
              : `${post.caption.slice(0, 100)}...`}
          </Typography>
          {post.caption.length > 100 && !showFullCaption && (
            <Typography
              variant="body2"
              component="span"
              sx={{ color: 'text.secondary', cursor: 'pointer', ml: 0.5 }}
              onClick={() => setShowFullCaption(true)}
            >
              더 보기
            </Typography>
          )}
        </Box>

        {/* 댓글 */}
        {post.commentsCount > 0 && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mt: 0.5,
              cursor: 'pointer',
            }}
            onClick={() => navigate(`/post/${post.id}`)}
          >
            댓글 {post.commentsCount}개 모두 보기
          </Typography>
        )}

        {/* 시간 */}
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
          {formatTimeAgo(post.createdAt)}
        </Typography>
      </Box>
    </Box>
  );
}

export default FeedCard;
