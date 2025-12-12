import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Divider from '@mui/material/Divider';

/**
 * CheckboxSection 컴포넌트
 *
 * MUI Checkbox와 FormControlLabel을 사용한 체크박스 섹션
 * 전체 선택/해제 기능과 체크된 항목 실시간 표시
 *
 * Props: 없음
 *
 * Example usage:
 * <CheckboxSection />
 */
function CheckboxSection() {
  const options = [
    { id: 'option1', label: '이메일 수신 동의' },
    { id: 'option2', label: 'SMS 수신 동의' },
    { id: 'option3', label: '푸시 알림 동의' },
    { id: 'option4', label: '마케팅 정보 수신 동의' }
  ];

  const [checked, setChecked] = useState({
    option1: false,
    option2: false,
    option3: false,
    option4: false
  });

  const handleChange = (id) => (event) => {
    setChecked((prev) => ({
      ...prev,
      [id]: event.target.checked
    }));
  };

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    const newChecked = {};
    options.forEach((option) => {
      newChecked[option.id] = isChecked;
    });
    setChecked(newChecked);
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const isAllChecked = checkedCount === options.length;
  const isIndeterminate = checkedCount > 0 && checkedCount < options.length;

  const getCheckedLabels = () => {
    return options
      .filter((option) => checked[option.id])
      .map((option) => option.label)
      .join(', ');
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
        Checkbox
      </Typography>

      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isAllChecked}
              indeterminate={isIndeterminate}
              onChange={handleSelectAll}
            />
          }
          label="전체 선택"
          sx={{ mb: 1 }}
        />
        
        <Divider sx={{ mb: 2 }} />

        <FormGroup>
          {options.map((option) => (
            <FormControlLabel
              key={option.id}
              control={
                <Checkbox
                  checked={checked[option.id]}
                  onChange={handleChange(option.id)}
                />
              }
              label={option.label}
            />
          ))}
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {checkedCount > 0
            ? '선택된 항목: ' + getCheckedLabels()
            : '선택된 항목이 없습니다'}
        </Typography>
      </Box>
    </Box>
  );
}

export default CheckboxSection;
