import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';

/**
 * TopBar 컴포넌트
 *
 * 메인 페이지 상단바
 * Props:
 * @param {boolean} hasNotification - 새 알림 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <TopBar hasNotification={true} />
 */
function TopBar({ hasNotification = false }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1.5,
        backgroundColor: 'background.default',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* 로고 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <InstagramIcon
          sx={{
            fontSize: 28,
            color: 'primary.main',
          }}
        />
        <Typography
          variant="h2"
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

      {/* 아이콘 영역 */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton onClick={() => navigate('/notifications')}>
          <Badge
            variant="dot"
            color="error"
            invisible={!hasNotification}
          >
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton onClick={() => navigate('/messages')}>
          <SendOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default TopBar;
