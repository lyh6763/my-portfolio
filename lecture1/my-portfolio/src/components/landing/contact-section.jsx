import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

/**
 * ContactSection 컴포넌트
 *
 * Props:
 * - 없음
 *
 * Example usage:
 * <ContactSection />
 */
function ContactSection() {
  return (
    <Box
      sx={{
        backgroundColor: '#FCE4E8',
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
              Contact
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                lineHeight: 1.8,
              }}
            >
              여기는 Contact 섹션입니다. 연락처, SNS, 간단한 메시지 폼이 들어갈 예정입니다.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default ContactSection;
