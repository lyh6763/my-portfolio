import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

/**
 * InputSection 컴포넌트
 *
 * MUI TextField의 다양한 variant를 보여주는 섹션
 * 입력값을 실시간으로 표시합니다.
 *
 * Props: 없음
 *
 * Example usage:
 * <InputSection />
 */
function InputSection() {
  const [values, setValues] = useState({
    standard: '',
    outlined: '',
    filled: ''
  });

  const handleChange = (variant) => (event) => {
    setValues((prev) => ({
      ...prev,
      [variant]: event.target.value
    }));
  };

  const variants = [
    { name: 'standard', label: 'Standard', placeholder: 'Standard 입력' },
    { name: 'outlined', label: 'Outlined', placeholder: 'Outlined 입력' },
    { name: 'filled', label: 'Filled', placeholder: 'Filled 입력' }
  ];

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
        Input
      </Typography>

      <Grid container spacing={3}>
        {variants.map((variant) => (
          <Grid key={variant.name} size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              variant={variant.name}
              label={variant.label}
              placeholder={variant.placeholder}
              value={values[variant.name]}
              onChange={handleChange(variant.name)}
            />
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: 'text.secondary',
                minHeight: '1.5rem'
              }}
            >
              {values[variant.name] && `입력값: ${values[variant.name]}`}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default InputSection;
