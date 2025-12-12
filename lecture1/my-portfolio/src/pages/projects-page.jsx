import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

/**
 * ProjectsPage 컴포넌트
 *
 * Props:
 * - 없음
 *
 * Example usage:
 * <ProjectsPage />
 */
function ProjectsPage() {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: { xs: 4, md: 8 },
        backgroundColor: 'background.default',
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
          <CardContent sx={{ p: { xs: 4, md: 6 } }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                mb: 4,
                textAlign: 'center',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Projects
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                lineHeight: 2,
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              Projects 페이지가 개발될 공간입니다. 포트폴리오 작품들이 들어갈 예정입니다.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default ProjectsPage;
