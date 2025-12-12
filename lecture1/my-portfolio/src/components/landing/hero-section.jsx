import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

/**
 * HeroSection 컴포넌트
 *
 * Props:
 * - 없음
 *
 * Example usage:
 * <HeroSection />
 */
function HeroSection() {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        py: { xs: 6, md: 10 },
        minHeight: { xs: '50vh', md: '60vh' },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: '#FFFFFF',
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 700,
            mb: 2,
            textAlign: 'center',
          }}
        >
          Hero Section
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: { xs: '1rem', md: '1.2rem' },
            textAlign: 'center',
            lineHeight: 1.8,
          }}
        >
          여기는 Hero 섹션입니다. 메인 비주얼, 이름, 간단 소개가 들어갈 예정입니다.
        </Typography>
      </Container>
    </Box>
  );
}

export default HeroSection;
