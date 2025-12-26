import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CreateIcon from '@mui/icons-material/Create';
import LogoutIcon from '@mui/icons-material/Logout';

/**
 * Navbar 컴포넌트
 *
 * Props:
 * @param {object} user - 현재 로그인된 사용자 정보 [Required]
 * @param {function} onLogout - 로그아웃 시 호출되는 함수 [Required]
 *
 * Example usage:
 * <Navbar user={currentUser} onLogout={handleLogout} />
 */
function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleWriteClick = () => {
    navigate('/create');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 'lg',
          width: '100%',
          mx: 'auto',
          px: { xs: 2, md: 3 },
        }}
      >
        <Box
          onClick={handleLogoClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            flexGrow: 1,
          }}
        >
          <SportsEsportsIcon
            sx={{
              fontSize: { xs: 28, md: 32 },
              color: 'primary.main',
              mr: 1,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Game Lounge
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
          <Button
            variant="contained"
            startIcon={<CreateIcon />}
            onClick={handleWriteClick}
            sx={{
              display: { xs: 'none', sm: 'flex' },
            }}
          >
            글쓰기
          </Button>
          <IconButton
            color="primary"
            onClick={handleWriteClick}
            sx={{
              display: { xs: 'flex', sm: 'none' },
            }}
          >
            <CreateIcon />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pl: { xs: 1, md: 2 },
              borderLeft: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                display: { xs: 'none', md: 'block' },
              }}
            >
              {user?.username}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={onLogout}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                },
              }}
            >
              로그아웃
            </Button>
            <IconButton
              size="small"
              onClick={onLogout}
              sx={{
                display: { xs: 'flex', sm: 'none' },
                color: 'text.secondary',
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
