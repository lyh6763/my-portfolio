import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import GuestbookForm from './guestbook-form';
import GuestbookList from './guestbook-list';

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
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmitSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FCE4E8',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 4,
            textAlign: 'center',
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          Contact & Guestbook
        </Typography>

        <GuestbookForm onSubmitSuccess={handleSubmitSuccess} />
        <GuestbookList refreshKey={refreshKey} />
      </Container>
    </Box>
  );
}

export default ContactSection;
