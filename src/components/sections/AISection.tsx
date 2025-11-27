import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Route, ScanSearch, BarChart3, Cpu } from 'lucide-react';

const AISection = () => {
  const aiApplications = [
    {
      icon: Route,
      title: "Optimización de Rutas",
      description: "Utilizamos algoritmos de IA para calcular las trayectorias más eficientes en la mesa de competencia, maximizando nuestra puntuación en el menor tiempo posible.",
      tags: ["Pathfinding", "Algoritmos", "Eficiencia"],
    },
    {
      icon: ScanSearch,
      title: "Reconocimiento de Objetos",
      description: "Entrenamos modelos de visión por computadora para que nuestros robots puedan identificar y manipular objetos de misión con alta precisión, adaptándose a variaciones en la iluminación y posición.",
      tags: ["Visión por Computadora", "Machine Learning", "Precisión"],
    },
    {
      icon: BarChart3,
      title: "Análisis de Datos de Rendimiento",
      description: "Recolectamos datos de cada prueba y competencia. La IA nos ayuda a analizar estos datos para identificar patrones, predecir resultados y encontrar áreas clave de mejora en nuestro robot y estrategia.",
      tags: ["Data Science", "Análisis Predictivo", "Mejora Continua"],
    },
    {
      icon: Cpu,
      title: "Proyecto de Innovación",
      description: "Aplicamos conceptos de IA para desarrollar soluciones innovadoras a problemas del mundo real, investigando cómo la tecnología puede generar un impacto social positivo.",
      tags: ["Innovación", "Resolución de Problemas", "Impacto Social"],
    },
  ];

  return (
    <section id="ia" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 animate-fade-in">
            Inteligencia Artificial en <span className="text-primary">Acción</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
            Cómo la IA potencia nuestros robots y proyectos de innovación, llevándonos al siguiente nivel.
          </p>
        </div>

        {/* AI Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {aiApplications.map((app, index) => {
            const IconComponent = app.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-card transition-all duration-700 bg-card/80 backdrop-blur-sm border-primary/10 hover:border-primary/30 animate-fade-in hover:scale-105 hover:-translate-y-4 cursor-pointer hover:shadow-2xl hover:shadow-primary/25"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'both'
                }}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-hero rounded-lg flex items-center justify-center group-hover:shadow-blue-glow group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
                      <IconComponent className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-125" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {app.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {app.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {app.tags.map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex} 
                        variant="secondary"
                        className="bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AISection;