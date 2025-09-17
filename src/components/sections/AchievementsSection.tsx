import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Target, TrendingUp, Award, Star, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';
const AchievementsSection = () => {
  const [visibleAchievements, setVisibleAchievements] = useState(0);
  const [animatedStats, setAnimatedStats] = useState(false);
  
  const achievements = [{
    year: "2022/2023",
    position: "50° Puesto",
    event: "Competencia Regional FLL",
    description: "Nuestro debut en FIRST LEGO League. Aprendimos mucho y sentamos las bases para el futuro.",
    highlights: ["Primera participación", "Experiencia invaluable", "Trabajo en equipo"],
    color: "text-muted-foreground",
    bgColor: "bg-muted/20"
  }, {
    year: "2023/2024",
    position: "32° Puesto",
    event: "Competencia Regional FLL",
    description: "Continuamos mejorando y ganando experiencia. Un paso más hacia nuestras metas.",
    highlights: ["Mejora significativa", "Mejor estrategia", "Mayor coordinación"],
    color: "text-muted-foreground",
    bgColor: "bg-muted/20"
  }, {
    year: "2024/2025",
    position: "12° Puesto",
    event: "Competencia Regional FLL",
    description: "Un gran salto en nuestro rendimiento. Llegamos al top 15 y seguimos creciendo.",
    highlights: ["Top 15", "Proyecto innovador", "Excelente presentación"],
    color: "text-accent",
    bgColor: "bg-accent/20"
  }, {
    year: "2025/2026",
    position: "¡A Ganar!",
    event: "Próxima Competencia",
    description: "Este año, estamos más preparados que nunca. Nuestro objetivo es llegar al primer lugar.",
    highlights: ["Robot optimizado", "Equipo experimentado", "Estrategia refinada"],
    color: "text-primary",
    bgColor: "bg-primary/20"
  }];
  
  useEffect(() => {
    // Staggered animation for achievements
    const timer = setInterval(() => {
      setVisibleAchievements(prev => {
        if (prev < achievements.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 800); // Show each achievement every 800ms

    // Trigger stats animation after achievements are done
    const statsTimer = setTimeout(() => {
      setAnimatedStats(true);
    }, achievements.length * 800 + 500);

    return () => {
      clearInterval(timer);
      clearTimeout(statsTimer);
    };
  }, []);
  
  const stats = [{
    icon: Trophy,
    value: "4",
    label: "Años Participando",
    description: "Experiencia acumulada"
  }, {
    icon: TrendingUp,
    value: "62%",
    label: "Mejora 2024/2025",
    description: "Crecimiento continuo"
  }, {
    icon: Target,
    value: "1°",
    label: "Meta 2025/2026",
    description: "Objetivo del año"
  }, {
    icon: Star,
    value: "8",
    label: "Miembros del Equipo",
    description: "Talentos diversos"
  }];
  const skills = ["Diseño de Robots", "Programación", "Investigación", "Presentación", "Trabajo en Equipo", "Innovación", "Resolución de Problemas", "Gracious Professionalism"];
  return <section id="logros" className="py-20 bg-gradient-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 animate-fade-in">
            Competencias & <span className="text-primary">Logros</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
            Nuestro viaje de crecimiento y aprendizaje a través de las competencias de FIRST LEGO League
          </p>
          
          {/* Progress Indicator */}
          <div className="mt-8 flex justify-center items-center space-x-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center space-x-1">
              <span className="text-3xl font-bold text-red-500">50°</span>
              <ArrowUp className="h-5 w-5 text-primary animate-bounce" />
              <span className="text-3xl font-bold text-orange-500">32°</span>
              <ArrowUp className="h-5 w-5 text-primary animate-bounce" style={{ animationDelay: '200ms' }} />
              <span className="text-3xl font-bold text-yellow-500">12°</span>
              <ArrowUp className="h-5 w-5 text-primary animate-bounce" style={{ animationDelay: '400ms' }} />
              <span className="text-3xl font-bold text-primary animate-pulse">🏆 ¡A Ganar!</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mb-16">
          {/* Animated Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary/20 rounded-full" 
               style={{ 
                 height: `${(visibleAchievements / achievements.length) * 100}%`,
                 transition: 'height 0.8s ease-in-out'
               }}>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
          
          <div className="space-y-12">
            {achievements.map((achievement, index) => {
              const isVisible = index < visibleAchievements;
              const isLast = index === achievements.length - 1;
              const shouldShowImprovement = index > 0 && isVisible;
              
              return (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className={`hover:shadow-card transition-all duration-700 border-primary/10 ${
                      isVisible 
                        ? 'opacity-100 translate-y-0 scale-100' 
                        : 'opacity-0 translate-y-8 scale-95'
                    } ${isLast ? 'shadow-xl shadow-primary/25 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5' : ''}`}>
                      <CardContent className="p-6 relative overflow-hidden">
                        {/* Special effect for final achievement */}
                        {isLast && isVisible && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse"></div>
                        )}
                        
                        <div className="space-y-4 relative">
                          <div className="flex items-center justify-between">
                            <Badge className={`${achievement.bgColor} ${achievement.color} border-0 transition-all duration-500 ${
                              isVisible ? 'scale-100' : 'scale-0'
                            }`} style={{ transitionDelay: `${index * 100}ms` }}>
                              {achievement.year}
                            </Badge>
                            <div className={`text-2xl font-bold ${achievement.color} transition-all duration-700 ${
                              isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-45'
                            } ${isLast ? 'text-3xl animate-pulse' : ''}`} 
                                 style={{ transitionDelay: `${index * 200}ms` }}>
                              {achievement.position}
                              {isLast && <span className="ml-2">✨</span>}
                            </div>
                          </div>
                          
                          {/* Improvement indicator */}
                          {shouldShowImprovement && (
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 animate-bounce">
                              <ArrowUp className="h-3 w-3" />
                            </div>
                          )}
                          
                          <h3 className="text-xl font-bold text-foreground">
                            {achievement.event}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {achievement.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {achievement.highlights.map((highlight, highlightIndex) => 
                              <Badge 
                                key={highlightIndex} 
                                variant="outline" 
                                className={`text-xs transition-all duration-300 ${
                                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                }`}
                                style={{ 
                                  transitionDelay: `${index * 300 + highlightIndex * 100}ms` 
                                }}
                              >
                                {highlight}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Animated Timeline dot */}
                  <div className="relative flex items-center justify-center">
                    <div className={`w-4 h-4 ${achievement.bgColor} ${achievement.color} rounded-full border-4 border-white shadow-lg z-10 transition-all duration-500 ${
                      isVisible 
                        ? 'scale-100 opacity-100' 
                        : 'scale-0 opacity-0'
                    } ${isLast && isVisible ? 'animate-pulse shadow-primary/50' : ''}`}
                         style={{ transitionDelay: `${index * 150}ms` }}>
                      {/* Ripple effect for achievements */}
                      {isVisible && (
                        <div className="absolute inset-0 rounded-full animate-ping opacity-30" 
                             style={{ 
                               backgroundColor: achievement.color.includes('primary') ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                               animationDelay: `${index * 200}ms`
                             }}>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Animated Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={index} 
                className={`text-center hover:shadow-card transition-all duration-700 border-primary/10 hover:border-primary/30 group hover:scale-105 hover:-translate-y-2 ${
                  animatedStats 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms` 
                }}
              >
                <CardContent className="p-6 relative overflow-hidden">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div className="space-y-3 relative">
                    <div className={`mx-auto w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center group-hover:shadow-blue-glow transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${
                      animatedStats 
                        ? 'scale-100 rotate-0' 
                        : 'scale-0 rotate-180'
                    }`}
                         style={{ 
                           transitionDelay: `${index * 200}ms` 
                         }}>
                      <IconComponent className="h-6 w-6 text-white transition-all duration-300 group-hover:scale-125" />
                    </div>
                    
                    {/* Animated counter effect */}
                    <div className={`text-3xl font-bold text-primary transition-all duration-700 ${
                      animatedStats 
                        ? 'scale-100 opacity-100' 
                        : 'scale-50 opacity-0'
                    } group-hover:scale-110`}
                         style={{ 
                           transitionDelay: `${index * 300}ms` 
                         }}>
                      {stat.value}
                      {stat.label.includes('Mejora') && animatedStats && (
                        <ArrowUp className="inline ml-1 h-5 w-5 text-green-500 animate-bounce" />
                      )}
                    </div>
                    
                    <div className={`text-sm font-semibold text-foreground transition-all duration-500 ${
                      animatedStats 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    } group-hover:text-primary`}
                         style={{ 
                           transitionDelay: `${index * 400}ms` 
                         }}>
                      {stat.label}
                    </div>
                    
                    <div className={`text-xs text-muted-foreground transition-all duration-500 ${
                      animatedStats 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    } group-hover:text-foreground`}
                         style={{ 
                           transitionDelay: `${index * 500}ms` 
                         }}>
                      {stat.description}
                    </div>
                  </div>
                  
                  {/* Floating improvement indicator */}
                  {stat.label.includes('Mejora') && animatedStats && (
                    <div className="absolute top-2 right-2 bg-green-500/20 text-green-600 rounded-full p-1 animate-pulse">
                      <TrendingUp className="h-3 w-3" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Skills and Recognition */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-primary/20">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Habilidades <span className="text-primary">Desarrolladas</span>
            </h3>
            <p className="text-muted-foreground">
              A través de nuestra participación en FLL, hemos desarrollado una amplia gama de habilidades
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {skills.map((skill, index) => 
              <Badge 
                key={index} 
                variant="secondary" 
                className={`bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 text-sm transition-all duration-500 hover:scale-110 hover:shadow-md ${
                  animatedStats 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms` 
                }}
              >
                {skill}
              </Badge>
            )}
          </div>

          
        </div>
      </div>
    </section>;
};
export default AchievementsSection;