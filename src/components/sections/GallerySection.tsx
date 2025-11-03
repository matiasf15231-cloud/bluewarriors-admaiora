import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Video, Play, Users, Bot, Trophy, Zap, ExternalLink } from 'lucide-react';

const GallerySection = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const mediaItems = [
    {
      src: '/placeholder.svg',
      title: 'Estrategia en la Mesa',
      description: 'Planificando los movimientos y misiones del robot en el campo de juego.',
      category: 'mesa',
      type: 'photo',
    },
    {
      src: '/placeholder.svg',
      title: 'Pruebas de Campo',
      description: 'Ejecutando pruebas para calibrar la precisión y eficiencia del robot.',
      category: 'mesa',
      type: 'photo',
    },
    {
      src: '/placeholder.svg',
      title: 'Construcción y Ajustes',
      description: 'El equipo trabajando en los detalles finales de los mecanismos del robot.',
      category: 'mesa',
      type: 'photo',
    },
  ];
  
  const categories = [{
    id: 'all',
    name: 'Todo',
    icon: Camera
  }, {
    id: 'eventos',
    name: 'Eventos',
    icon: Trophy
  }, {
    id: 'excursiones',
    name: 'Excursiones',
    icon: ExternalLink
  }, {
    id: 'profesionales',
    name: 'Sesiones con Profesionales',
    icon: Users
  }, {
    id: 'mesa',
    name: 'Mesa',
    icon: Bot
  }, {
    id: 'videos',
    name: 'Videos',
    icon: Video
  }];
  
  const filteredItems = activeTab === 'all' ? mediaItems : mediaItems.filter(item => item.category === activeTab);
  
  return (
    <section id="galeria" className="py-20 bg-gradient-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Galería <span className="text-primary">Multimedia</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explora nuestro trabajo, competencias y momentos especiales del equipo.
          </p>
        </div>

        {/* Sistema de Filtración */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={activeTab === category.id ? "default" : "outline"}
                onClick={() => setActiveTab(category.id)}
                className={`group flex items-center gap-2 px-6 py-3 transform transition-all duration-300 hover:scale-105 animate-fade-in ${
                  activeTab === category.id 
                    ? 'shadow-lg shadow-primary/25' 
                    : 'hover:shadow-md hover:border-primary/50'
                }`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <IconComponent className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Área de Contenido */}
        <div className="min-h-[400px] flex items-center justify-center">
          {filteredItems.length === 0 ? (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/20 flex items-center justify-center">
                <Camera className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Contenido Próximamente
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Estamos preparando contenido increíble para esta sección. ¡Vuelve pronto para ver nuestras últimas actualizaciones!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => {
                return (
                  <Card 
                    key={index} 
                    className="group overflow-hidden hover:shadow-blue-glow transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer animate-fade-in"
                    style={{ 
                      animationDelay: `${index * 150}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={item.src} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-all duration-300">
                            <Play className="h-12 w-12 text-white/80 transition-all duration-300 group-hover:scale-110 group-hover:text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                            {item.type === 'video' ? 'Video' : 'Foto'}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg text-foreground mb-2 transition-colors duration-300 group-hover:text-primary">{item.title}</h3>
                        <p className="text-muted-foreground text-sm transition-colors duration-300 group-hover:text-foreground">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default GallerySection;