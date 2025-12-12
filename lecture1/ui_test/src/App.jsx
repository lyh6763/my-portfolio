import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ButtonSection from './components/sections/button-section';
import InputSection from './components/sections/input-section';
import NavigationSection from './components/sections/navigation-section';
import DropdownSection from './components/sections/dropdown-section';
import CheckboxSection from './components/sections/checkbox-section';
import RadioSection from './components/sections/radio-section';
import SliderSection from './components/sections/slider-section';

function App() {
  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      py: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            textAlign: 'center',
            mb: 4,
            fontWeight: 500,
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          UI Test Project
        </Typography>

        <ButtonSection />
        <InputSection />
        <NavigationSection />
        <DropdownSection />
        <CheckboxSection />
        <RadioSection />
        <SliderSection />

      </Container>
    </Box>
  );
}

export default App;
