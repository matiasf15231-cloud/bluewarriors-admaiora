import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Code2, Lightbulb, Zap, Play, ExternalLink } from 'lucide-react';
import PhotoGalleryModal from '@/components/PhotoGalleryModal';
const RobotsSection = () => {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPrototype, setSelectedPrototype] = useState('');
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
    tech: ["SpikePrime", "Sensores de color", "Motor básico"],
    status: "Investigación"
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
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 animate-fade-in-up opacity-0">
            Robots & <span className="text-primary">Proyectos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up opacity-0 stagger-1">
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
          <h3 className="text-2xl font-bold text-center text-foreground mb-8 animate-fade-in-up opacity-0 stagger-2">
            Prototipos <span className="text-primary">2025-2026</span>
          </h3>
          
          {/* Date Filter */}
          <div className="max-w-md mx-auto mb-8 animate-scale-in opacity-0 stagger-3">
            <div className="flex items-center gap-4 justify-center">
              <label className="text-sm font-medium text-foreground">Filtrar por fecha:</label>
              <select 
                value={selectedMonth} 
                onChange={e => setSelectedMonth(e.target.value)} 
                className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 hover:border-primary/50 focus:scale-105"
              >
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
                  {filteredPrototypes.map((prototype, index) => <Card key={index} className="group hover:shadow-card transition-all duration-smooth border-green-500/30 hover:border-green-500/50 bg-green-50/50 dark:bg-green-950/20 max-w-md w-full">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs border-green-600 text-green-600">{prototype.date}</Badge>
                          <Badge variant="outline" className="border-green-600 text-green-600">
                            {prototype.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-green-600 transition-colors duration-smooth">
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
                                85 piezas
                              </Badge>
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
                          <Button size="sm" variant="outline" className="flex-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white" onClick={() => {
                      setSelectedPrototype(prototype.title);
                      setIsGalleryOpen(true);
                    }}>
                            <Play className="w-4 h-4 mr-2" />
                            Ver Fotos
                          </Button>
                          <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-100 dark:hover:bg-green-900">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>)}
                </div>;
          })()}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-gradient-section rounded-2xl p-8 sm:p-12 hover:shadow-2xl transition-all duration-500 animate-fade-in-up opacity-0 stagger-5">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12 animate-fade-in-up opacity-0 stagger-6">
            Nuestras <span className="text-primary">Especialidades</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill, index) => {
            const IconComponent = skill.icon;
            return <div key={index} className="text-center space-y-4 group animate-scale-in opacity-0" style={{ animationDelay: `${0.7 + index * 0.1}s` }}>
                  <div className="mx-auto w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center shadow-blue-glow group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                    <IconComponent className="h-8 w-8 text-white group-hover:scale-125 transition-all duration-300" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{skill.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {skill.description}
                  </p>
                </div>;
          })}
          </div>
        </div>

        {/* Gallery Preview */}
        <div className="mt-16 text-center animate-fade-in-up opacity-0 stagger-7">
          <h3 className="text-2xl font-bold text-foreground mb-6">Galería de Robots</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array.from({
            length: 8
          }).map((_, index) => <div 
              key={index} 
              className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center border border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer group hover-lift animate-scale-in opacity-0" 
              style={{ animationDelay: `${0.8 + index * 0.05}s` }}
            >
                <Bot className="h-8 w-8 text-primary group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 animate-float" style={{ animationDelay: `${index * 0.3}s` }} />
              </div>)}
          </div>
          <Button variant="outline" size="lg" className="hover:scale-105 hover:shadow-blue-glow transition-all duration-300 animate-scale-in opacity-0 stagger-8">
            Ver Galería Completa
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Photo Gallery Modal */}
        <PhotoGalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} prototypeTitle={selectedPrototype} />
      </div>
    </section>;
};
export default RobotsSection;