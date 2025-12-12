import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';

/**
 * DropdownSection 컴포넌트
 *
 * MUI Select와 MenuItem을 사용한 드롭다운 섹션
 * 선택값을 실시간으로 표시합니다.
 *
 * Props: 없음
 *
 * Example usage:
 * <DropdownSection />
 */
function DropdownSection() {
  const [values, setValues] = useState({
    fruit: '',
    city: '',
    language: ''
  });

  const handleChange = (name) => (event) => {
    setValues((prev) => ({
      ...prev,
      [name]: event.target.value
    }));
  };

  const dropdowns = [
    {
      name: 'fruit',
      label: '과일 선택',
      options: [
        { value: 'apple', label: '사과' },
        { value: 'banana', label: '바나나' },
        { value: 'orange', label: '오렌지' },
        { value: 'grape', label: '포도' },
        { value: 'watermelon', label: '수박' }
      ]
    },
    {
      name: 'city',
      label: '도시 선택',
      options: [
        { value: 'seoul', label: '서울' },
        { value: 'busan', label: '부산' },
        { value: 'daegu', label: '대구' },
        { value: 'incheon', label: '인천' }
      ]
    },
    {
      name: 'language',
      label: '언어 선택',
      options: [
        { value: 'korean', label: '한국어' },
        { value: 'english', label: '영어' },
        { value: 'japanese', label: '일본어' }
      ]
    }
  ];

  const getSelectedLabel = (dropdown) => {
    const selected = dropdown.options.find((opt) => opt.value === values[dropdown.name]);
    return selected ? selected.label : '';
  };

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
        Dropdown
      </Typography>

      <Grid container spacing={3}>
        {dropdowns.map((dropdown) => (
          <Grid key={dropdown.name} size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel id={dropdown.name + '-label'}>
                {dropdown.label}
              </InputLabel>
              <Select
                labelId={dropdown.name + '-label'}
                id={dropdown.name}
                value={values[dropdown.name]}
                label={dropdown.label}
                onChange={handleChange(dropdown.name)}
              >
                {dropdown.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: 'text.secondary',
                minHeight: '1.5rem'
              }}
            >
              {values[dropdown.name] && ('선택: ' + getSelectedLabel(dropdown))}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default DropdownSection;
