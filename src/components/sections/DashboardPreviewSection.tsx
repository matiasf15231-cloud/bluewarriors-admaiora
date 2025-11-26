import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import Clock from '@/components/Clock';
import RemindersDialog from '@/components/RemindersDialog';
import { BellRing, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { es } from 'date-fns/locale';

const DashboardPreviewSection = () => {
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user } = useAuth();

  return (
    <section id="dashboard-preview" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Organización & <span className="text-primary">Planificación</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Mantente al día con tus tareas, misiones y fechas importantes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Calendar */}
          <Card className="lg:col-span-1 hover:shadow-card transition-shadow duration-300">
            <CardContent className="p-2 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                locale={es}
              />
            </CardContent>
          </Card>

          {/* Clock and Reminders */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="hover:shadow-card transition-shadow duration-300">
              <CardContent className="p-8">
                <Clock />
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Recordatorios de Misiones</CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <>
                    <p className="text-muted-foreground mb-4">
                      Gestiona tus tareas y proyectos pendientes para no olvidar nada importante.
                    </p>
                    <Button onClick={() => setIsRemindersOpen(true)} className="w-full">
                      <BellRing className="h-4 w-4 mr-2" />
                      Ver mis Recordatorios
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-4">
                      Inicia sesión para crear y gestionar tus recordatorios personales.
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/login">
                        <LogIn className="h-4 w-4 mr-2" />
                        Iniciar Sesión para ver Recordatorios
                      </Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {user && <RemindersDialog isOpen={isRemindersOpen} onClose={() => setIsRemindersOpen(false)} />}
    </section>
  );
};

export default DashboardPreviewSection;