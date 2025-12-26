import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

/**
 * SettingsPage 컴포넌트
 *
 * 설정 페이지
 * - 계정 설정, 알림 설정, 개인정보 설정
 * - 차단 관리, 고객센터
 * - 로그아웃, 회원탈퇴
 */
function SettingsPage() {
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    like: true,
    comment: true,
    follow: true,
    message: true,
  });
  const [privacySettings, setPrivacySettings] = useState({
    isPrivate: false,
    showActivity: true,
    showReadReceipt: true,
  });

  const handleNotificationChange = (key) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyChange = (key) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = () => {
    // TODO: 로그아웃 로직 구현
    console.log('로그아웃');
    navigate('/');
  };

  const handleWithdraw = () => {
    // TODO: 회원탈퇴 로직 구현
    console.log('회원탈퇴');
    navigate('/');
  };

  const menuItems = [
    {
      icon: <PersonOutlineIcon />,
      label: '계정 설정',
      onClick: () => navigate('/settings/account'),
    },
    {
      icon: <NotificationsOutlinedIcon />,
      label: '알림 설정',
      onClick: () => navigate('/settings/notifications'),
    },
    {
      icon: <LockOutlinedIcon />,
      label: '개인정보 설정',
      onClick: () => navigate('/settings/privacy'),
    },
    {
      icon: <BlockOutlinedIcon />,
      label: '차단 관리',
      onClick: () => navigate('/settings/blocked'),
    },
    {
      icon: <HelpOutlineIcon />,
      label: '고객센터/문의',
      onClick: () => {},
    },
  ];

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
          display: 'flex',
          alignItems: 'center',
          p: 2,
          backgroundColor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h2" sx={{ ml: 1 }}>
          설정
        </Typography>
      </Box>

      {/* 메뉴 목록 */}
      <Box>
        {menuItems.map((item, index) => (
          <Box
            key={index}
            onClick={item.onClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 2,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'background.paper',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {item.icon}
              <Typography variant="body1">{item.label}</Typography>
            </Box>
            <ChevronRightIcon sx={{ color: 'text.secondary' }} />
          </Box>
        ))}
      </Box>

      {/* 구분선 */}
      <Box sx={{ height: 8, backgroundColor: 'background.paper' }} />

      {/* 로그아웃 */}
      <Box
        onClick={() => setLogoutDialogOpen(true)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 2,
          py: 2,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'background.paper',
          },
        }}
      >
        <LogoutIcon sx={{ color: 'error.main' }} />
        <Typography variant="body1" sx={{ color: 'error.main' }}>
          로그아웃
        </Typography>
      </Box>

      {/* 회원탈퇴 */}
      <Box
        onClick={() => setWithdrawDialogOpen(true)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 2,
          py: 2,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'background.paper',
          },
        }}
      >
        <DeleteOutlineIcon sx={{ color: 'text.secondary' }} />
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          회원탈퇴
        </Typography>
      </Box>

      {/* 로그아웃 확인 다이얼로그 */}
      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
        <DialogTitle>로그아웃</DialogTitle>
        <DialogContent>
          <Typography>정말 로그아웃 하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>취소</Button>
          <Button onClick={handleLogout} color="error">
            로그아웃
          </Button>
        </DialogActions>
      </Dialog>

      {/* 회원탈퇴 확인 다이얼로그 */}
      <Dialog open={withdrawDialogOpen} onClose={() => setWithdrawDialogOpen(false)}>
        <DialogTitle>회원탈퇴</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            정말 탈퇴하시겠습니까? 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
          </Typography>
          <TextField
            fullWidth
            type="password"
            placeholder="비밀번호 확인"
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialogOpen(false)}>취소</Button>
          <Button onClick={handleWithdraw} color="error">
            탈퇴하기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SettingsPage;
