import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

/**
 * ButtonSection 컴포넌트
 *
 * MUI Button의 다양한 variant와 color 조합을 보여주는 섹션
 *
 * Props: 없음
 *
 * Example usage:
 * <ButtonSection />
 */
function ButtonSection() {
  const handleClick = (variant, color) => {
    alert(`${color} ${variant} 버튼이 클릭되었습니다!`);
  };

  const variants = ['contained', 'outlined', 'text'];
  const colors = ['primary', 'secondary', 'error'];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          mb: 3,
          fontWeight: 500,
          fontSize: { xs: '1.25rem', md: '1.5rem' }
        }}
      >
        Button
      </Typography>

      <Grid container spacing={3}>
        {variants.map((variant) => (
          <Grid key={variant} size={{ xs: 12, md: 4 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 2,
                textTransform: 'capitalize',
                color: 'text.secondary'
              }}
            >
              {variant}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {colors.map((color) => (
                <Button
                  key={`${variant}-${color}`}
                  variant={variant}
                  color={color}
                  onClick={() => handleClick(variant, color)}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {color}
                </Button>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ButtonSection;
