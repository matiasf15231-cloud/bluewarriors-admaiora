import { Button } from '@/components/ui/button';
import { ArrowDown, Bot, Trophy } from 'lucide-react';
import heroImage from '@/assets/bluewarriors.png';
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
      <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-20 animate-shimmer" style={{
      backgroundImage: `url(${heroImage})`
    }}></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float opacity-30">
        <Bot className="h-16 w-16 text-blue-200" />
      </div>
      <div className="absolute top-40 right-20 animate-float opacity-20" style={{ animationDelay: '1s' }}>
        <Trophy className="h-12 w-12 text-blue-300" />
      </div>
      <div className="absolute bottom-32 left-20 animate-float opacity-25" style={{ animationDelay: '0.5s' }}>
        <Bot className="h-10 w-10 text-blue-200" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white animate-fade-in-up opacity-0">
              Blue<span className="text-blue-200">Warriors</span>
            </h1>
            <div className="flex items-center justify-center space-x-2 text-blue-100 animate-fade-in-up opacity-0 stagger-1">
              <Bot className="h-8 w-8 animate-rotate-in stagger-2" />
              <span className="text-xl sm:text-2xl">FIRST LEGO League</span>
              <Trophy className="h-8 w-8 animate-rotate-in stagger-3" />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up opacity-0 stagger-2">
            Representando a AdMaiora con innovación, determinación y espíritu de equipo
          </p>

          {/* Stats */}
          

          {/* CTA Button */}
          <div className="pt-4">
            <Button 
              onClick={scrollToTeam} 
              size="lg" 
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm text-lg px-8 py-3 transition-all duration-300 shadow-blue-glow hover:shadow-2xl hover:scale-105 animate-scale-in opacity-0 stagger-3 animate-glow-pulse"
            >
              Conocer al Equipo
              <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce opacity-0 animate-fade-in-up stagger-4">
        <ArrowDown className="h-6 w-6 text-white/70" />
      </div>
    </section>;
};
export default HeroSection;