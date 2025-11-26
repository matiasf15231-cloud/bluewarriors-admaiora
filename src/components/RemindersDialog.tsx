import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Bell, BellRing, CalendarIcon, Plus, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Zod schema for form validation
const reminderSchema = z.object({
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres.' }),
  description: z.string().optional(),
  due_date: z.date().optional(),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

interface Reminder {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  is_completed: boolean;
}

const RemindersDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { permission, requestNotificationPermission } = useNotifications();

  // Form setup
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  // Fetch reminders
  const { data: reminders, isLoading, isError } = useQuery<Reminder[]>({
    queryKey: ['reminders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  // Add reminder mutation
  const addMutation = useMutation({
    mutationFn: async (newReminder: ReminderFormValues) => {
      if (!user) throw new Error('Usuario no autenticado');
      const { data, error } = await supabase.from('reminders').insert({ ...newReminder, user_id: user.id }).select();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', user?.id] });
      toast({ title: 'Recordatorio creado', description: 'Tu nuevo recordatorio ha sido añadido.' });
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Update reminder mutation (for completion)
  const updateMutation = useMutation({
    mutationFn: async ({ id, is_completed }: { id: string; is_completed: boolean }) => {
      const { error } = await supabase.from('reminders').update({ is_completed }).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', user?.id] });
    },
  });

  // Delete reminder mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reminders').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders', user?.id] });
      toast({ title: 'Recordatorio eliminado' });
    },
  });

  const onSubmit = (values: ReminderFormValues) => {
    addMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BellRing className="h-6 w-6 text-primary" /> Mis Recordatorios
          </DialogTitle>
          <DialogDescription>
            Añade, gestiona y completa tus tareas y recordatorios aquí.
          </DialogDescription>
        </DialogHeader>

        {permission === 'default' && (
          <Alert className="mb-4">
            <Bell className="h-4 w-4" />
            <AlertTitle>¡No te pierdas nada!</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              Activa las notificaciones para recibir avisos de tus recordatorios.
              <Button variant="outline" size="sm" onClick={requestNotificationPermission}>
                Activar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Add Reminder Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border-b pb-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nuevo Recordatorio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Preparar presentación del proyecto..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 items-end">
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Límite (Opcional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Elige una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Añadir
              </Button>
            </div>
          </form>
        </Form>

        {/* Reminders List */}
        <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
          {isLoading && <div className="text-center py-8">Cargando recordatorios...</div>}
          {isError && <div className="text-destructive text-center py-8">Error al cargar los recordatorios.</div>}
          {!isLoading && !isError && reminders?.length === 0 && (
            <div className="text-muted-foreground text-center py-8">No tienes recordatorios pendientes.</div>
          )}
          {reminders?.map((reminder) => (
            <div key={reminder.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-secondary">
              <Checkbox
                id={`reminder-${reminder.id}`}
                checked={reminder.is_completed}
                onCheckedChange={(checked) => updateMutation.mutate({ id: reminder.id, is_completed: !!checked })}
              />
              <div className="flex-1">
                <label
                  htmlFor={`reminder-${reminder.id}`}
                  className={cn("font-medium", reminder.is_completed && "line-through text-muted-foreground")}
                >
                  {reminder.title}
                </label>
                {reminder.due_date && (
                  <p className="text-xs text-muted-foreground">
                    Vence el {format(new Date(reminder.due_date), "PPP", { locale: es })}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteMutation.mutate(reminder.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemindersDialog;