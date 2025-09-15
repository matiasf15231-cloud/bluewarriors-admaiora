import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Code, Wrench, Lightbulb, Star, Target } from 'lucide-react';
const TeamSection = () => {
  const teamMembers = [{
    name: "Oscar Luis",
    role: "Líder",
    description: "Líder estratégico con experiencia en FLL",
    skills: ["Liderazgo", "Estrategia", "Presentaciones"],
    icon: Star
  }, {
    name: "Diego Celestino",
    role: "Investigador",
    description: "Experto en programación de robots y algoritmos",
    skills: ["Python", "EV3", "Algoritmos"],
    icon: Code
  }, {
    name: "Rodrigo Damian",
    role: "Creativo",
    description: "Especialista en diseño mecánico y construcción",
    skills: ["Mecánica", "Diseño", "Innovación"],
    icon: Wrench
  }, {
    name: "Marian Jimenez",
    role: "Comunicadora",
    description: "Enfocado en el proyecto de innovación y investigación",
    skills: ["Investigación", "Análisis", "Innovación"],
    icon: Lightbulb
  }, {
    name: "Eduardo Bon",
    role: "Organizador de Materiales",
    description: "Planificación de misiones y análisis estratégico",
    skills: ["Estrategia", "Análisis", "Planificación"],
    icon: Target
  }, {
    name: "Franklin Vargas",
    role: "Profesor Mentor",
    description: "Guía y mentor del equipo BlueWarriors",
    skills: ["Mentoría", "Educación", "Liderazgo"],
    icon: Users
  }, {
    name: "Génesis Ogando",
    role: "Profesora Asistente",
    description: "Apoyo técnico y educativo del equipo",
    skills: ["Educación", "Apoyo Técnico", "Coordinación"],
    icon: Users
  }];
  return <section id="equipo" className="py-20 bg-gradient-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Nuestro <span className="text-primary">Equipo</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">Somos un equipo diverso y apasionado de República Dominicana, unidos por nuestra pasión por la robótica y la innovación.</p>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-primary/20">
              <h3 className="text-2xl font-bold text-primary mb-4">Nuestra Historia</h3>
              <p className="text-foreground">Fundado en 2022, BlueWarriors. A través de la dedicación, el trabajo en equipo y el aprendizaje continuo, hemos evolucionado desde principiantes hasta competidores serios, mejorando consistentemente nuestro rendimiento cada año.</p>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => {
          const IconComponent = member.icon;
          return <Card key={index} className="group hover:shadow-card transition-all duration-smooth bg-white/80 backdrop-blur-sm border-primary/10 hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center group-hover:shadow-blue-glow transition-all duration-smooth">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Info */}
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                      <p className="text-primary font-semibold mb-3">{member.role}</p>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {member.description}
                      </p>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.skills.map((skill, skillIndex) => <Badge key={skillIndex} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                          {skill}
                        </Badge>)}
                    </div>
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