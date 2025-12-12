import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';

/**
 * SliderSection 컴포넌트
 *
 * MUI Slider 컴포넌트를 사용한 슬라이더 섹션
 * 현재값을 실시간으로 표시합니다.
 *
 * Props: 없음
 *
 * Example usage:
 * <SliderSection />
 */
function SliderSection() {
  const [values, setValues] = useState({
    basic: 50,
    stepped: 30,
    range: [20, 80]
  });

  const handleChange = (name) => (event, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue
    }));
  };

  const basicMarks = [
    { value: 0, label: '0' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 75, label: '75' },
    { value: 100, label: '100' }
  ];

  const steppedMarks = [
    { value: 0, label: '0' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 40, label: '40' },
    { value: 50, label: '50' }
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
        Slider
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
              기본 슬라이더
            </Typography>
            <Slider
              value={values.basic}
              onChange={handleChange('basic')}
              valueLabelDisplay="auto"
              marks={basicMarks}
              min={0}
              max={100}
            />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              {'현재값: ' + values.basic}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
              단계별 슬라이더 (step: 10)
            </Typography>
            <Slider
              value={values.stepped}
              onChange={handleChange('stepped')}
              valueLabelDisplay="on"
              marks={steppedMarks}
              step={10}
              min={0}
              max={50}
            />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              {'현재값: ' + values.stepped}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
              범위 슬라이더
            </Typography>
            <Slider
              value={values.range}
              onChange={handleChange('range')}
              valueLabelDisplay="auto"
              marks={basicMarks}
              min={0}
              max={100}
            />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              {'범위: ' + values.range[0] + ' - ' + values.range[1]}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SliderSection;
