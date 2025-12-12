import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

/**
 * AboutSection 컴포넌트
 *
 * Props:
 * - 없음
 *
 * Example usage:
 * <AboutSection />
 */
function AboutSection() {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: 3,
                textAlign: 'center',
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              About Me
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                mb: 3,
                lineHeight: 1.8,
              }}
            >
              여기는 About Me 섹션입니다. 간단한 자기소개와 더 알아보기 버튼이 들어갈 예정입니다.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/about"
              >
                더 알아보기
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default AboutSection;
