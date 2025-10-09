import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bot, Code2, Lightbulb, Zap, Play, ExternalLink } from 'lucide-react';
import PhotoGalleryModal from '@/components/PhotoGalleryModal';
import robotTrabajoReal from '@/assets/robot-trabajo-real.png';
import equipoMedallasReal from '@/assets/equipo-medallas-real.png';
import sesion1Foto3 from '@/assets/sesion-1-foto-3.jpg';
import sesion1Foto4 from '@/assets/sesion-1-foto-4.jpg';
import sesion1Foto5 from '@/assets/sesion-1-foto-5.jpg';
const RobotsSection = () => {
  const [selectedMonth, setSelectedMonth] = useState('octubre-2025');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPrototype, setSelectedPrototype] = useState('');
  const [selectedSession, setSelectedSession] = useState(1);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const mainRobot = {
    title: "Robot Competidor 2026",
    type: "Robot Principal",
    description: "Nuestro robot más avanzado, optimizado para las misiones de la temporada 2026.",
    features: ["Brazo articulado", "Sistema de navegación preciso", "Mecanismo de agarre dual"],
    tech: ["SpikePrime", "Sensores ultrasónicos", "Motor de precisión"],
    status: "En desarrollo"
  };
  const prototypes = [{
    title: "Robot Prototipo #1",
    date: "Septiembre 2025",
    month: "septiembre-2025",
    description: "Primer prototipo de desarrollo para pruebas y experimentación de la temporada 2025-2026.",
    features: ["Diseño modular", "Base de movimiento optimizada", "Sistema de sensores básico"],
    tech: ["SpikePrime", "Motor"],
    status: "Investigación"
  }, {
    title: "Robot Prototipo #2",
    date: "Septiembre 2025",
    month: "septiembre-2025",
    description: "Segundo prototipo con mejoras en el sistema de tracción y mayor complejidad mecánica.",
    features: ["Tracción mejorada", "Sistema dual de motores", "Estructura reforzada"],
    tech: ["SpikePrime", "Motor de tracción", "Motor auxiliar"],
    status: "En desarrollo"
  }, {
    title: "Robot Prototipo #3",
    date: "Octubre 2025",
    month: "octubre-2025",
    description: "Tercer prototipo avanzado con estructura más grande, sistema de tracción optimizado y arquitectura robusta para competencia.",
    features: ["Estructura más grande", "Sistema de tracción avanzado", "Arquitectura robusta"],
    tech: ["SpikePrime", "Motores duales", "Sensores integrados"],
    status: "En desarrollo"
  }];
  const skills = [{
    icon: Code2,
    title: "Programación",
    description: "Desarrollamos algoritmos eficientes para navegación autónoma y completar misiones con precisión."
  }, {
    icon: Bot,
    title: "Construcción Mecánica",
    description: "Diseñamos y construimos robots robustos que pueden manejar los desafíos más complejos."
  }, {
    icon: Lightbulb,
    title: "Innovación",
    description: "Investigamos problemas reales y desarrollamos soluciones tecnológicas creativas."
  }, {
    icon: Zap,
    title: "Optimización",
    description: "Continuamente mejoramos el rendimiento y la eficiencia de nuestros robots."
  }];
  return <section id="robots" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Robots & <span className="text-primary">Proyectos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Exploramos la intersección entre creatividad e ingeniería, construyendo robots 
            que no solo compiten, sino que también resuelven problemas del mundo real.
          </p>
        </div>

        {/* Main Robot */}
        <div className="flex justify-center mb-16">
          <div className="max-w-md w-full">
            
          </div>
        </div>

        {/* Prototypes List */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            Prototipos <span className="text-primary">2025-2026</span>
          </h3>
          
          {/* Date Filter */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center gap-4 justify-center">
              <label className="text-sm font-medium text-foreground">Filtrar por fecha:</label>
              <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="all">Todas las fechas</option>
                <option value="septiembre-2025">Septiembre 2025</option>
                <option value="octubre-2025">Octubre 2025</option>
                <option value="noviembre-2025">Noviembre 2025</option>
                <option value="diciembre-2025">Diciembre 2025</option>
                <option value="enero-2026">Enero 2026</option>
                <option value="febrero-2026">Febrero 2026</option>
                <option value="marzo-2026">Marzo 2026</option>
                <option value="abril-2026">Abril 2026</option>
                <option value="mayo-2026">Mayo 2026</option>
                <option value="junio-2026">Junio 2026</option>
              </select>
            </div>
          </div>

          {/* Prototypes Grid */}
          <div className="max-w-5xl mx-auto">
            {(() => {
            const filteredPrototypes = selectedMonth === 'all' ? prototypes : prototypes.filter(prototype => prototype.month === selectedMonth);
            if (filteredPrototypes.length === 0) {
              return <div className="text-center py-12">
                    <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No hay prototipos disponibles para el mes seleccionado</p>
                  </div>;
            }
            return <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
                  {filteredPrototypes.map((prototype, index) => <Card 
                      key={index} 
                      className="group hover:shadow-card transition-all duration-500 border-green-500/30 hover:border-green-500/50 bg-green-50/50 dark:bg-green-950/20 max-w-md w-full hover:scale-105 hover:-translate-y-3 cursor-pointer animate-fade-in"
                      style={{ 
                        animationDelay: `${index * 200}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <CardHeader className="pb-4 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-t-lg"></div>
                        <div className="flex items-center justify-between mb-2 relative z-10">
                          <Badge variant="outline" className="text-xs border-green-600 text-green-600 transition-all duration-300 group-hover:bg-green-600 group-hover:text-white group-hover:scale-110">{prototype.date}</Badge>
                          <Badge variant="outline" className="border-green-600 text-green-600 transition-all duration-300 group-hover:bg-green-600 group-hover:text-white group-hover:scale-110 group-hover:animate-pulse">
                            {prototype.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-green-600 transition-all duration-300 group-hover:scale-105 relative z-10">
                          {prototype.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {prototype.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-foreground text-sm mb-1">Características:</h5>
                            <div className="flex flex-wrap gap-1">
                              {prototype.features.slice(0, 2).map((feature, featureIndex) => <Badge key={featureIndex} variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                  {feature}
                                </Badge>)}
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                {prototype.title === "Robot Prototipo #3" ? "110 piezas" : prototype.title === "Robot Prototipo #2" ? "96 piezas" : "85 piezas"}
                              </Badge>
                              {prototype.title === "Robot Prototipo #3" && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                  49 de carcasa
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-foreground text-sm mb-1">Tecnología:</h5>
                            <div className="flex flex-wrap gap-1">
                              {prototype.tech.map((tech, techIndex) => <Badge key={techIndex} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>)}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="group/btn flex-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25" 
                            onClick={() => {
                              setSelectedPrototype(prototype.title);
                              setIsGalleryOpen(true);
                            }}
                          >
                            <Play className="w-4 h-4 mr-2 transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-12" />
                            Ver Fotos
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="group/btn text-green-600 hover:bg-green-100 dark:hover:bg-green-900 transition-all duration-300 hover:scale-110 hover:rotate-12"
                          >
                            <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-125" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>)}
                </div>;
          })()}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-gradient-section rounded-2xl p-8 sm:p-12 animate-fade-in">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12 animate-fade-in">
            Nuestras <span className="text-primary animate-pulse">Especialidades</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill, index) => {
            const IconComponent = skill.icon;
            return <div 
                key={index} 
                className="text-center space-y-4 group cursor-pointer animate-fade-in hover:scale-110 hover:-translate-y-4 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/25"
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  animationFillMode: 'both'
                }}
              >
                  <div className="mx-auto w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center shadow-blue-glow group-hover:shadow-blue-glow group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 group-hover:animate-pulse">
                    <IconComponent className="h-8 w-8 text-white group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-all duration-300 group-hover:scale-105">{skill.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-all duration-300">
                    {skill.description}
                  </p>
                  
                  {/* Floating particles effect */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-ping" style={{ animationDelay: '0.1s' }}></div>
                    <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-accent/40 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                    <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-primary/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>;
          })}
          </div>
        </div>

        {/* Sessions Preview */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-6">Sesiones</h3>
          
          {/* Session Display */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-primary mb-4">Sesión {selectedSession}</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 min-h-[200px]">
              {(() => {
                // Define session photos here - all empty for now
                const sessionPhotos: Record<number, Array<{src: string, alt: string}>> = {
                  1: [],
                  2: [],
                  3: [],
                  4: [],
                  5: []
                };
                
                const photos = sessionPhotos[selectedSession] || [];
                
                if (photos.length === 0) {
                  return (
                    <div className="col-span-full flex items-center justify-center py-12">
                      <p className="text-muted-foreground">No hay fotos disponibles para esta sesión</p>
                    </div>
                  );
                }
                
                return photos.map((photo, index) => (
                  <div 
                    key={index}
                    className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center border border-primary/20 hover:border-primary/40 transition-all duration-500 cursor-pointer group hover:scale-105 hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/25 animate-fade-in overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                  >
                    <img 
                      src={photo.src} 
                      alt={photo.alt} 
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></div>
                  </div>
                ));
              })()}
            </div>
          </div>
          
          <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="lg"
                className="group transition-all duration-500 hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
              >
                Ver Todas las Sesiones
                <ExternalLink className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-45" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Seleccionar Sesión</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                {[1, 2, 3, 4, 5].map((session) => (
                  <Button
                    key={session}
                    variant={selectedSession === session ? "default" : "outline"}
                    onClick={() => {
                      setSelectedSession(session);
                      setIsSessionDialogOpen(false);
                    }}
                    className="h-20 text-lg transition-all duration-300 hover:scale-105"
                  >
                    Sesión {session}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Photo Gallery Modal */}
        <PhotoGalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} prototypeTitle={selectedPrototype} />
      </div>
    </section>;
};
export default RobotsSection;