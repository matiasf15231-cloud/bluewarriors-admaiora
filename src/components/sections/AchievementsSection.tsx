import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Target, TrendingUp, Award, Star } from 'lucide-react';
const AchievementsSection = () => {
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
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Competencias & <span className="text-primary">Logros</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nuestro viaje de crecimiento y aprendizaje a través de las competencias de FIRST LEGO League
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mb-16">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20 rounded-full"></div>
          
          <div className="space-y-12">
            {achievements.map((achievement, index) => <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <Card className="hover:shadow-card transition-all duration-smooth border-primary/10">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className={`${achievement.bgColor} ${achievement.color} border-0`}>
                            {achievement.year}
                          </Badge>
                          <div className={`text-2xl font-bold ${achievement.color}`}>
                            {achievement.position}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                          {achievement.event}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {achievement.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {achievement.highlights.map((highlight, highlightIndex) => <Badge key={highlightIndex} variant="outline" className="text-xs">
                              {highlight}
                            </Badge>)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Timeline dot */}
                <div className="relative flex items-center justify-center">
                  <div className={`w-4 h-4 ${achievement.bgColor} ${achievement.color} rounded-full border-4 border-white shadow-lg z-10`}></div>
                </div>
                
                <div className="w-1/2"></div>
              </div>)}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return <Card key={index} className="text-center hover:shadow-card transition-all duration-smooth border-primary/10 hover:border-primary/30 group">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="mx-auto w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center group-hover:shadow-blue-glow transition-all duration-smooth">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm font-semibold text-foreground">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </div>
                </CardContent>
              </Card>;
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
            {skills.map((skill, index) => <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 text-sm">
                {skill}
              </Badge>)}
          </div>

          
        </div>
      </div>
    </section>;
};
export default AchievementsSection;