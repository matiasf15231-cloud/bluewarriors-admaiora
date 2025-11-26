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

const DashboardPreviewSection = () => {
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch reminders for the preview
  const { data: reminders, isLoading } = useQuery<Reminder[]>({
    queryKey: ['reminders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('reminders')
        .select('id, title, is_completed')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3); // Only fetch the top 3
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
    <section id="dashboard-preview" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 right-4 sm:right-6 lg:right-8">
          <Clock variant="small" />
        </div>
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

          {/* Reminders */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="hover:shadow-card transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Próximos Recordatorios</CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6" />
                        <Skeleton className="h-6 w-3/4" />
                      </div>
                    ) : reminders && reminders.length > 0 ? (
                      <div className="space-y-3">
                        {reminders.map((reminder) => (
                          <div key={reminder.id} className="flex items-center gap-3">
                            <Checkbox
                              id={`preview-${reminder.id}`}
                              checked={reminder.is_completed}
                              onCheckedChange={(checked) => updateMutation.mutate({ id: reminder.id, is_completed: !!checked })}
                            />
                            <label
                              htmlFor={`preview-${reminder.id}`}
                              className={cn("text-sm font-medium leading-none", reminder.is_completed && "line-through text-muted-foreground")}
                            >
                              {reminder.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No tienes recordatorios pendientes. ¡Añade uno!</p>
                    )}
                    <Button onClick={() => setIsRemindersOpen(true)} className="w-full mt-4">
                      <BellRing className="h-4 w-4 mr-2" />
                      Gestionar todos los Recordatorios
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-4">
                      Inicia sesión para ver y gestionar tus recordatorios.
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/login">
                        <LogIn className="h-4 w-4 mr-2" />
                        Iniciar Sesión
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