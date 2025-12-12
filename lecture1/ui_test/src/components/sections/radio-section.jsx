import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';

/**
 * RadioSection 컴포넌트
 *
 * MUI RadioGroup과 FormControlLabel을 사용한 라디오 버튼 섹션
 * 선택값을 실시간으로 표시합니다.
 *
 * Props: 없음
 *
 * Example usage:
 * <RadioSection />
 */
function RadioSection() {
  const [values, setValues] = useState({
    gender: '',
    plan: '',
    contact: ''
  });

  const handleChange = (name) => (event) => {
    setValues((prev) => ({
      ...prev,
      [name]: event.target.value
    }));
  };

  const radioGroups = [
    {
      name: 'gender',
      label: '성별',
      options: [
        { value: 'male', label: '남성' },
        { value: 'female', label: '여성' },
        { value: 'other', label: '기타' }
      ]
    },
    {
      name: 'plan',
      label: '요금제',
      options: [
        { value: 'basic', label: 'Basic' },
        { value: 'standard', label: 'Standard' },
        { value: 'premium', label: 'Premium' },
        { value: 'enterprise', label: 'Enterprise' }
      ]
    },
    {
      name: 'contact',
      label: '연락 방법',
      options: [
        { value: 'email', label: '이메일' },
        { value: 'phone', label: '전화' },
        { value: 'sms', label: 'SMS' }
      ]
    }
  ];

  const getSelectedLabel = (group) => {
    const selected = group.options.find((opt) => opt.value === values[group.name]);
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
        Radio
      </Typography>

      <Grid container spacing={3}>
        {radioGroups.map((group) => (
          <Grid key={group.name} size={{ xs: 12, md: 4 }}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <FormControl>
                <FormLabel id={group.name + '-label'}>
                  {group.label}
                </FormLabel>
                <RadioGroup
                  aria-labelledby={group.name + '-label'}
                  name={group.name}
                  value={values[group.name]}
                  onChange={handleChange(group.name)}
                >
                  {group.options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: 'text.secondary',
                  minHeight: '1.5rem'
                }}
              >
                {values[group.name] && ('선택: ' + getSelectedLabel(group))}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RadioSection;
