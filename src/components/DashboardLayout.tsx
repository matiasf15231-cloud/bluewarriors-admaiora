import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarBody, SidebarContent } from './DashboardSidebar';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/hooks/useNotifications';

interface Reminder {
  id: string;
  title: string;
  due_date: string | null;
  is_completed: boolean;
}

const DashboardLayout = () => {
  const { user } = useAuth();
  const { permission, sendNotification } = useNotifications();
  const timeoutIds = useRef(new Map<string, NodeJS.Timeout>());

  const { data: reminders } = useQuery<Reminder[]>({
    queryKey: ['reminders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('reminders')
        .select('id, title, due_date, is_completed')
        .eq('user_id', user.id);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user && permission === 'granted', // Only fetch if notifications are enabled
  });

  useEffect(() => {
    // Clear previous timeouts when reminders change
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current.clear();

    if (permission === 'granted' && reminders) {
      reminders.forEach((reminder) => {
        if (!reminder.is_completed && reminder.due_date) {
          const dueDate = new Date(reminder.due_date);
          const now = new Date();
          const delay = dueDate.getTime() - now.getTime();

          if (delay > 0) {
            const timeoutId = setTimeout(() => {
              sendNotification(`Recordatorio: ${reminder.title}`, {
                body: '¡Es hora de completar tu tarea!',
                tag: reminder.id, // Use tag to prevent duplicate notifications if logic runs again
              });
            }, delay);
            timeoutIds.current.set(reminder.id, timeoutId);
          }
        }
      });
    }

    // Cleanup function to clear all timeouts on unmount
    return () => {
      timeoutIds.current.forEach(clearTimeout);
    };
  }, [reminders, permission, sendNotification]);

  return (
    <Sidebar>
      <div className="flex h-screen bg-background">
        <SidebarBody>
          <SidebarContent />
        </SidebarBody>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </Sidebar>
  );
};

export default DashboardLayout;