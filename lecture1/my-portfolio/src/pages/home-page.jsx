import Box from '@mui/material/Box';
import HeroSection from '../components/landing/hero-section';
import AboutSection from '../components/landing/about-section';
import SkillSection from '../components/landing/skill-section';
import ProjectsSection from '../components/landing/projects-section';
import ContactSection from '../components/landing/contact-section';

/**
 * HomePage 컴포넌트
 *
 * Props:
 * - 없음
 *
 * Example usage:
 * <HomePage />
 */
function HomePage() {
  return (
    <Box>
      <HeroSection />
      <AboutSection />
      <SkillSection />
      <ProjectsSection />
      <ContactSection />
    </Box>
  );
}

export default HomePage;
