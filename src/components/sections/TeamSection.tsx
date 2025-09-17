import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Code, Wrench, Lightbulb, Star, Target } from 'lucide-react';
const TeamSection = () => {
  const teamMembers = [{
    name: "Oscar Luis",
    role: "Líder",
    description: "Me encanta liderar proyectos y ver cómo cada compañero aporta ideas únicas. Siempre busco que todos participen activamente.",
    skills: ["Liderazgo", "Motivación", "Comunicación"],
    icon: Star,
    personality: "El que mantiene a todos unidos y enfocados"
  }, {
    name: "Diego Celestino",
    role: "Investigador",
    description: "Disfruto investigando datos y descubriendo patrones. Me fascina encontrar la mejor estrategia para cada desafío.",
    skills: ["Investigación", "Datos", "Estrategia"],
    icon: Code,
    personality: "El que siempre tiene la respuesta basada en datos"
  }, {
    name: "Rodrigo Damian",
    role: "Creativo",
    description: "Mis manos cobran vida cuando construyo robots. Me emociona ver cómo mis diseños toman forma y funcionan perfectamente.",
    skills: ["Construcción", "Diseño 3D", "Mecánica"],
    icon: Wrench,
    personality: "El artista de las piezas LEGO y los engranajes"
  }, {
    name: "Mariam Jimenez",
    role: "Comunicadora",
    description: "Me apasiona comunicar nuestras ideas y proyectos. Creo que las mejores innovaciones deben ser compartidas con el mundo.",
    skills: ["Presentaciones", "Creatividad", "Storytelling"],
    icon: Lightbulb,
    personality: "La que convierte ideas complejas en historias increíbles"
  }, {
    name: "Eduardo Bon",
    role: "Organizador de Materiales",
    description: "Soy el que se asegura de que no perdamos ninguna pieza importante. Me encanta planificar cada detalle de nuestras misiones.",
    skills: ["Organización", "Logística", "Planificación"],
    icon: Target,
    personality: "El guardián del orden y la eficiencia"
  }, {
    name: "Franklin Vargas",
    role: "Profesor Mentor",
    description: "Guío a estos increíbles jóvenes en su camino hacia la excelencia. Mi misión es verlos crecer y alcanzar sus sueños.",
    skills: ["Mentoría", "Enseñanza", "Inspiración"],
    icon: Users,
    personality: "El sabio consejero que siempre cree en nosotros"
  }, {
    name: "Génesis Ogando",
    role: "Profesora Asistente",
    description: "Ayudo al equipo a resolver problemas técnicos y a mantener la motivación alta. Me encanta ver su progreso diario.",
    skills: ["Soporte Técnico", "Motivación", "Resolución"],
    icon: Users,
    personality: "La que siempre encuentra una solución cuando todo parece imposible"
  }, {
    name: "Ian Valdez",
    role: "Mentor",
    description: "Me dedico al desarrollo integral de cada miembro del equipo. Creo en el potencial ilimitado de cada joven.",
    skills: ["Desarrollo Personal", "Coaching", "Crecimiento"],
    icon: Target,
    personality: "El que nos ayuda a ser la mejor versión de nosotros mismos"
  }];
  return <section id="equipo" className="py-20 bg-gradient-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 animate-fade-in">
            Nuestro <span className="text-primary">Equipo</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
              Somos 8 mentes creativas unidas por la pasión compartida de construir, programar y competir juntos.
            </p>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-primary/20 hover:bg-white/70 hover:border-primary/40 transition-all duration-500 hover:shadow-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
              <h3 className="text-2xl font-bold text-primary mb-4">Nuestra Historia</h3>
              <p className="text-foreground">
                Desde 2022, hemos crecido como familia. Lo que comenzó como curiosidad por los robots 
                se convirtió en una aventura increíble llena de risas, desafíos y muchos "¡Lo logramos!" 
                Cada competencia nos ha enseñado algo nuevo, y cada proyecto nos une más como equipo.
              </p>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => {
          const IconComponent = member.icon;
          return <Card 
              key={index} 
              className="group hover:shadow-card transition-all duration-smooth bg-white/80 backdrop-blur-sm border-primary/10 hover:border-primary/30 animate-fade-in hover:scale-105 hover:-translate-y-2 cursor-pointer" 
              style={{ 
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'both'
              }}
            >
                <CardContent className="p-6 relative overflow-hidden">
                  {/* Background animation effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"></div>
                  
                  <div className="text-center space-y-4 relative">
                    {/* Icon with enhanced animation */}
                    <div className="mx-auto w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center group-hover:shadow-blue-glow group-hover:scale-110 transition-all duration-300 group-hover:rotate-6">
                      <IconComponent className="h-8 w-8 text-white transition-all duration-300 group-hover:scale-125" />
                    </div>
                    
                    {/* Info with staggered animations */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-primary font-semibold mb-2 group-hover:scale-105 transition-transform duration-300">
                        {member.role}
                      </p>
                      
                      {/* Personality badge - appears on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 mb-3">
                        <Badge variant="outline" className="text-xs bg-accent/20 text-accent-foreground border-accent/30 font-medium">
                          {member.personality}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors duration-300">
                        {member.description}
                      </p>
                    </div>

                    {/* Skills with individual animations */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.skills.map((skill, skillIndex) => 
                        <Badge 
                          key={skillIndex} 
                          variant="secondary" 
                          className="bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110"
                          style={{
                            animationDelay: `${(index * 150) + (skillIndex * 100)}ms`
                          }}
                        >
                          {skill}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>

        {/* Team Values */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-8">Nuestros Valores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
            title: "Innovación",
            desc: "Buscamos soluciones creativas y efectivas"
          }, {
            title: "Inclusión",
            desc: "Valoramos la diversidad y respetamos a todos"
          }, {
            title: "Trabajo en equipo",
            desc: "Colaboramos para alcanzar nuestros objetivos"
          }, {
            title: "Descubrimiento",
            desc: "Exploramos nuevas ideas y aprendemos constantemente"
          }, {
            title: "Impacto",
            desc: "Buscamos generar un cambio positivo en nuestra comunidad"
          }, {
            title: "Diversión",
            desc: "Disfrutamos cada momento del proceso de aprendizaje"
          }].map((value, index) => <div key={index} className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
                <h4 className="font-bold text-primary mb-2">{value.title}</h4>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default TeamSection;