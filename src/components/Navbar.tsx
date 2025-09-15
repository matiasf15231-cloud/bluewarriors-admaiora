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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              BlueWarriors
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-smooth rounded-md hover:bg-secondary"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Instagram Links */}
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-border">
                <a
                  href="https://www.instagram.com/blu_ewarriors/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-foreground hover:text-primary transition-colors duration-smooth rounded-md hover:bg-secondary"
                  title="BlueWarriors Instagram"
                >
                  <Trophy className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/fll.rd/?hl=es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-foreground hover:text-primary transition-colors duration-smooth rounded-md hover:bg-secondary"
                  title="FIRST Lego League RD Instagram"
                >
                  <Bot className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-border">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors duration-smooth"
                >
                  <IconComponent className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;