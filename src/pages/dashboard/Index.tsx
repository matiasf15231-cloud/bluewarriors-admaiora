import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import Clock from '@/components/Clock';
import RemindersDialog from '@/components/RemindersDialog';
import { BellRing } from 'lucide-react';
import { es } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Reminder {
  id: string;
  title: string;
  is_completed: boolean;
}

const DashboardHome = () => {
  const { user } = useAuth();
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const queryClient = useQueryClient();

  // Fetch reminders
  const { data: reminders, isLoading } = useQuery<Reminder[]>({
    queryKey: ['reminders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('reminders')
        .select('id, title, is_completed')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  // Update reminder mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, is_completed }: { id: string; is_completed: boolean }) => {
      const { error } = await supabase.from('reminders').update({ is_completed }).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', user?.id] });
    },
  });

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 z-10">
        <Clock variant="small" />
      </div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Home</h1>
        <p className="text-muted-foreground">
          ¡Bienvenido a tu panel de control, {user?.email}!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-16">
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

        {/* Reminders */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="hover:shadow-card transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Mis Recordatorios</CardTitle>
              <CardDescription>
                Gestiona tus tareas y proyectos pendientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="max-h-48 overflow-y-auto pr-2 space-y-3">
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-5/6" />
                      <Skeleton className="h-6 w-3/4" />
                    </div>
                  ) : reminders && reminders.length > 0 ? (
                    reminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary">
                        <Checkbox
                          id={`dashboard-${reminder.id}`}
                          checked={reminder.is_completed}
                          onCheckedChange={(checked) => updateMutation.mutate({ id: reminder.id, is_completed: !!checked })}
                        />
                        <label
                          htmlFor={`dashboard-${reminder.id}`}
                          className={cn("text-sm font-medium leading-none", reminder.is_completed && "line-through text-muted-foreground")}
                        >
                          {reminder.title}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">No tienes recordatorios pendientes.</p>
                  )}
                </div>
                <Button onClick={() => setIsRemindersOpen(true)} className="w-full mt-4">
                  <BellRing className="h-4 w-4 mr-2" />
                  Añadir o ver todos los Recordatorios
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <RemindersDialog isOpen={isRemindersOpen} onClose={() => setIsRemindersOpen(false)} />
    </div>
  );
};

export default DashboardHome;