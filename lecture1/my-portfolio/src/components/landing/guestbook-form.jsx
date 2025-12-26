import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { supabase } from '../../utils/supabase';

/**
 * GuestbookForm 컴포넌트
 *
 * Props:
 * @param {function} onSubmitSuccess - 방명록 등록 성공 시 호출할 함수 [Required]
 *
 * Example usage:
 * <GuestbookForm onSubmitSuccess={handleRefresh} />
 */
function GuestbookForm({ onSubmitSuccess }) {
  const [authorName, setAuthorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [contact, setContact] = useState('');
  const [isContactPublic, setIsContactPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!isAnonymous && !authorName.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      setError('방명록 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('guestbook')
        .insert([
          {
            author_name: isAnonymous ? '익명' : authorName.trim(),
            is_anonymous: isAnonymous,
            content: content.trim(),
            rating,
            contact: contact.trim() || null,
            is_contact_public: isContactPublic,
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      setAuthorName('');
      setIsAnonymous(false);
      setContent('');
      setRating(5);
      setContact('');
      setIsContactPublic(false);

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      setError('방명록 등록에 실패했습니다. 다시 시도해주세요.');
      console.error('Guestbook insert error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mb: 4,
        p: { xs: 2, md: 3 },
        backgroundColor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontSize: { xs: '1rem', md: '1.25rem' },
        }}
      >
        방명록 작성
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          방명록이 등록되었습니다!
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="이름"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            disabled={isAnonymous || isLoading}
            placeholder={isAnonymous ? '익명' : '이름을 입력하세요'}
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                disabled={isLoading}
              />
            }
            label="익명으로 작성"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="방명록 내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
            placeholder="메시지를 남겨주세요"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              평점:
            </Typography>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              disabled={isLoading}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="연락처 (선택)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            disabled={isLoading}
            placeholder="이메일 또는 전화번호"
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isContactPublic}
                onChange={(e) => setIsContactPublic(e.target.checked)}
                disabled={isLoading || !contact.trim()}
              />
            }
            label="연락처 공개"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ minWidth: 120 }}
          >
            {isLoading ? <CircularProgress size={24} /> : '등록하기'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GuestbookForm;
