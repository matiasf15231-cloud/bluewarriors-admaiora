import { Button } from '@/components/ui/button';
import { ArrowDown, Bot, Trophy } from 'lucide-react';
import heroImage from '@/assets/bluewarriors.png';
import logo from '@/assets/bluewarriors-logo.png';

const HeroSection = () => {
  const scrollToTeam = () => {
    const element = document.querySelector('#equipo');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-20" style={{
      backgroundImage: `url(${heroImage})`
    }}></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Main Title */}
          <div className="space-y-4">
            <img src={logo} alt="BlueWarriors Logo" className="w-full max-w-2xl mx-auto" />
            <div className="flex items-center justify-center space-x-2 text-blue-100">
              <Bot className="h-8 w-8" />
              <span className="text-xl sm:text-2xl">FIRST LEGO League</span>
              <Trophy className="h-8 w-8" />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">Representando a AdMaiora con innovación, determinación y espíritu de equipo</p>

          {/* Stats */}
          

          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              onClick={scrollToTeam} 
              size="lg" 
              className="group bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm text-lg px-8 py-3 transition-all duration-500 shadow-blue-glow hover:shadow-xl hover:shadow-blue-500/30 hover:scale-110"
            >
              Conocer al Equipo
              <ArrowDown className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-y-1 group-hover:animate-bounce" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-white/70" />
      </div>
    </section>;
};
export default HeroSection;