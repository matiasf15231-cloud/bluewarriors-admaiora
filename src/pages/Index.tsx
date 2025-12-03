import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import TeamSection from '@/components/sections/TeamSection';
import RobotsSection from '@/components/sections/RobotsSection';
import AchievementsSection from '@/components/sections/AchievementsSection';
import GallerySection from '@/components/sections/GallerySection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TeamSection />
      <RobotsSection />
      <AchievementsSection />
      <GallerySection />
    </div>
  );
};

export default Index;
