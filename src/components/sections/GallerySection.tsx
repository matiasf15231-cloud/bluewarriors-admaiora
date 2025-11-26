import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Video, Play, Users, Bot, Trophy, Zap, ExternalLink, Target } from 'lucide-react';
import GalleryModal from '@/components/GalleryModal';

// Import user-provided images
import image1 from '@/assets/IMG_0538.png';
import image2 from '@/assets/IMG_0539.png';

// Import user-provided videos
import video1 from '@/assets/1000030709.mp4';
import video2 from '@/assets/1000030710.mp4';
import video3 from '@/assets/1000030711.mp4';

interface MediaItem {
  src: string;
  title: string;
  description: string;
  category: string;
  type: 'photo' | 'video';
}

const GallerySection = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const mediaItems: MediaItem[] = [
    {
      src: image1,
      title: 'Preparando la Misión',
      description: 'Ajustando el robot para una de las misiones en la mesa de FLL.',
      category: 'mesa',
      type: 'photo',
    },
    {
      src: image2,
      title: 'Robot en la Mesa',
      description: 'Vista del robot y la mesa de competencia durante una sesión de práctica.',
      category: 'mesa',
      type: 'photo',
    },
    {
      src: video1,
      title: 'Sesión con Profesional 1',
      description: 'Aprendiendo de expertos de la industria para mejorar nuestro proyecto.',
      category: 'profesionales',
      type: 'video',
    },
    {
      src: video2,
      title: 'Sesión con Profesional 2',
      description: 'Recibiendo feedback valioso sobre nuestro robot y estrategia.',
      category: 'profesionales',
      type: 'video',
    },
    {
      src: video3,
      title: 'Sesión con Profesional 3',
      description: 'Charla inspiradora sobre innovación y tecnología con un profesional del área.',
      category: 'profesionales',
      type: 'video',
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
    id: 'misiones',
    name: 'Misiones',
    icon: Target
  }, {
    id: 'videos',
    name: 'Videos',
    icon: Video
  }];
  
  const filteredItems =
    activeTab === 'all'
      ? mediaItems
      : activeTab === 'videos'
      ? mediaItems.filter((item) => item.type === 'video')
      : mediaItems.filter((item) => item.category === activeTab);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <section id="galeria" className="py-20 bg-gradient-section">
      <div className="max-w-7xl mx-auto px-4 sm-px-6 lg-px-8">
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
                const videoRef = useRef<HTMLVideoElement>(null);

                const handleMouseEnter = () => {
                  if (videoRef.current) {
                    videoRef.current.play().catch(error => {
                      console.error("Video play failed:", error);
                    });
                  }
                };

                const handleMouseLeave = () => {
                  if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                  }
                };

                return (
                  <Card 
                    key={index} 
                    className="group overflow-hidden hover:shadow-blue-glow transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer animate-fade-in"
                    style={{ 
                      animationDelay: `${index * 150}ms`,
                      animationFillMode: 'both'
                    }}
                    onClick={() => handleImageClick(index)}
                    onMouseEnter={item.type === 'video' ? handleMouseEnter : undefined}
                    onMouseLeave={item.type === 'video' ? handleMouseLeave : undefined}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-video relative overflow-hidden">
                        {item.type === 'photo' ? (
                          <img 
                            src={item.src}
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <video
                            ref={videoRef}
                            src={item.src}
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all duration-300">
                          {item.type === 'video' && (
                            <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                              <Play className="h-8 w-8 text-white/90" />
                            </div>
                          )}
                        </div>
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

      <GalleryModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        media={filteredItems} 
        startIndex={selectedImageIndex}
      />
    </section>
  );
};
export default GallerySection;