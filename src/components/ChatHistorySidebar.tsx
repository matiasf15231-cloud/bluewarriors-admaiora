import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link, NavLink, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

const ChatHistorySidebar = () => {
  const { user } = useAuth();
  const { conversationId } = useParams();

  const { data: conversations, isLoading } = useQuery<Conversation[]>({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('conversations')
        .select('id, title, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="h-full bg-card flex flex-col w-64 border-r">
      <div className="p-4">
        <Button asChild className="w-full">
          <Link to="/dashboard/ai-chat">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nuevo Chat
          </Link>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : conversations && conversations.length > 0 ? (
            conversations.map((convo) => (
              <NavLink
                key={convo.id}
                to={`/dashboard/ai-chat/${convo.id}`}
                className={({ isActive }) => cn(
                  'block p-3 rounded-lg hover:bg-secondary transition-colors',
                  isActive ? 'bg-secondary' : ''
                )}
              >
                <p className="text-sm font-medium truncate">{convo.title || 'Nuevo Chat'}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(convo.created_at), { locale: es, addSuffix: true })}
                </p>
              </NavLink>
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground p-4">
              <MessageSquare className="h-8 w-8 mx-auto mb-2" />
              No hay chats guardados.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistorySidebar;