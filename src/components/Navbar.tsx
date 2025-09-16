import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Trophy, Users, Bot, Medal, Camera } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Inicio', href: '#inicio', icon: Trophy },
    { name: 'Nuestro Equipo', href: '#equipo', icon: Users },
    { name: 'Robots & Proyectos', href: '#robots', icon: Bot },
    { name: 'Logros', href: '#logros', icon: Medal },
    { name: 'Galería', href: '#galeria', icon: Camera },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-card transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer animate-fade-in-down">
              BlueWarriors
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-all duration-300 rounded-md hover:bg-secondary hover:scale-105 animate-fade-in-down opacity-0"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:scale-110 transition-all duration-300"
            >
              <div className={`transform transition-all duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-border animate-fade-in-down">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="flex items-center w-full px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md transition-all duration-300 hover:scale-105 hover:translate-x-2 animate-slide-in-left opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <IconComponent className="h-5 w-5 mr-3 transition-all duration-300 hover:rotate-12" />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;