import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PersonIcon from '@mui/icons-material/Person';

/**
 * BottomNav 컴포넌트
 *
 * 하단 네비게이션 바 (고정)
 * - 홈, 검색, 업로드, 프로필 탭
 *
 * Example usage:
 * <BottomNav />
 */
function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      path: '/home',
      icon: HomeOutlinedIcon,
      activeIcon: HomeIcon,
      label: '홈',
    },
    {
      path: '/search',
      icon: SearchOutlinedIcon,
      activeIcon: SearchIcon,
      label: '검색',
    },
    {
      path: '/upload',
      icon: AddBoxOutlinedIcon,
      activeIcon: AddBoxOutlinedIcon,
      label: '업로드',
    },
    {
      path: '/profile',
      icon: PersonOutlineOutlinedIcon,
      activeIcon: PersonIcon,
      label: '프로필',
    },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'background.default',
        borderTop: '1px solid',
        borderColor: 'divider',
        zIndex: 100,
      }}
    >
      {navItems.map((item) => {
        const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <IconButton
            key={item.path}
            onClick={() => navigate(item.path)}
            sx={{
              color: isActive ? 'text.primary' : 'text.secondary',
            }}
          >
            <Icon sx={{ fontSize: 24 }} />
          </IconButton>
        );
      })}
    </Box>
  );
}

export default BottomNav;
