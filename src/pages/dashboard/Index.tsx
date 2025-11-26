import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import Clock from '@/components/Clock';
import RemindersDialog from '@/components/RemindersDialog';
import { BellRing } from 'lucide-react';
import { es } from 'date-fns/locale';

const DashboardHome = () => {
  const { user } = useAuth();
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Home</h1>
        <p className="text-muted-foreground">
          ¡Bienvenido a tu panel de control, {user?.email}!
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
              <p className="text-muted-foreground mb-4">
                Gestiona tus tareas y proyectos pendientes para no olvidar nada importante.
              </p>
              <Button onClick={() => setIsRemindersOpen(true)} className="w-full">
                <BellRing className="h-4 w-4 mr-2" />
                Ver mis Recordatorios
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <RemindersDialog isOpen={isRemindersOpen} onClose={() => setIsRemindersOpen(false)} />
    </div>
  );
};

export default DashboardHome;