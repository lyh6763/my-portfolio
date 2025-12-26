import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { supabase } from '../../utils/supabase';

/**
 * GuestbookList 컴포넌트
 *
 * Props:
 * @param {number} refreshKey - 목록 새로고침을 위한 키 값 [Optional]
 *
 * Example usage:
 * <GuestbookList refreshKey={refreshKey} />
 */
function GuestbookList({ refreshKey }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGuestbook = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setEntries(data || []);
    } catch (err) {
      setError('방명록을 불러오는데 실패했습니다.');
      console.error('Guestbook fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestbook();
  }, [refreshKey]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (entries.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
          color: 'text.secondary',
        }}
      >
        <Typography variant="body1">
          아직 방명록이 없습니다. 첫 번째 방명록을 남겨보세요!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontSize: { xs: '1rem', md: '1.25rem' },
        }}
      >
        방명록 목록 ({entries.length}개)
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {entries.map((entry) => (
          <Card
            key={entry.id}
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', md: 'center' },
                  mb: 1,
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    icon={<PersonIcon />}
                    label={entry.author_name}
                    size="small"
                    color={entry.is_anonymous ? 'default' : 'primary'}
                    variant={entry.is_anonymous ? 'outlined' : 'filled'}
                  />
                  <Rating value={entry.rating} size="small" readOnly />
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary' }}
                >
                  {formatDate(entry.created_at)}
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {entry.content}
              </Typography>

              {entry.is_contact_public && entry.contact && (
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <EmailIcon
                    sx={{ fontSize: 16, color: 'text.secondary' }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    {entry.contact}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default GuestbookList;
