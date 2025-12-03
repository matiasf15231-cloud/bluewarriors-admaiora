import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Trophy, Users, Bot, Medal, Camera } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/bluewarriors-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Inicio', href: '#inicio', icon: Trophy },
    { name: 'Nuestro Equipo', href: '#equipo', icon: Users },
    { name: 'Robots & Proyectos', href: '#robots', icon: Bot },
    { name: 'Logros', href: '#logros', icon: Medal },
    { name: 'Galería', href: '#galeria', icon: Camera },
  ];

  const scrollToSection = (href: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 bg-background/95 backdrop-blur-sm border border-border shadow-card rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={logo} alt="BlueWarriors Logo" className="h-16" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="group px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-all duration-300 rounded-md hover:bg-secondary hover:scale-105 hover:shadow-md relative overflow-hidden"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </button>
              ))}
            </div>
            <ThemeToggle />
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
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
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="group flex items-center w-full px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md transition-all duration-300 hover:scale-105 hover:shadow-md relative overflow-hidden"
                >
                  <IconComponent className="h-5 w-5 mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
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