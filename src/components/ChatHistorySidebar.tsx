import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link, NavLink, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquare, Loader2, Trash2, Edit } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

const ChatHistorySidebar = () => {
  const { user } = useAuth();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [convoToDelete, setConvoToDelete] = useState<Conversation | null>(null);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [convoToRename, setConvoToRename] = useState<Conversation | null>(null);
  const [newTitle, setNewTitle] = useState('');

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

  const hasReachedConvoLimit = conversations && conversations.length >= 10;

  const deleteMutation = useMutation({
    mutationFn: async (convoId: string) => {
      const { error } = await supabase.from('conversations').delete().eq('id', convoId);
      if (error) throw new Error(error.message);
      return convoId;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
      toast({ title: 'Chat eliminado', description: 'La conversación ha sido eliminada.' });
      
      if (conversationId === deletedId) {
        navigate('/dashboard/ai-chat');
      }
      
      setIsDeleteDialogOpen(false);
      setConvoToDelete(null);
    },
    onError: (error) => {
      toast({ title: 'Error al eliminar', description: error.message, variant: 'destructive' });
    },
  });

  const renameMutation = useMutation({
    mutationFn: async ({ convoId, title }: { convoId: string; title: string }) => {
      const { error } = await supabase.from('conversations').update({ title }).eq('id', convoId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
      toast({ title: 'Chat renombrado' });
      setIsRenameDialogOpen(false);
      setConvoToRename(null);
      setNewTitle('');
    },
    onError: (error) => {
      toast({ title: 'Error al renombrar', description: error.message, variant: 'destructive' });
    },
  });

  const openDeleteDialog = (convo: Conversation) => {
    setConvoToDelete(convo);
    setIsDeleteDialogOpen(true);
  };

  const openRenameDialog = (convo: Conversation) => {
    setConvoToRename(convo);
    setNewTitle(convo.title || '');
    setIsRenameDialogOpen(true);
  };

  const handleRenameSubmit = () => {
    if (convoToRename && newTitle.trim()) {
      renameMutation.mutate({ convoId: convoToRename.id, title: newTitle.trim() });
    }
  };

  return (
    <>
      <div className="h-full bg-card flex flex-col w-64 border-r">
        <div className="p-4 border-b">
          <Button asChild className="w-full" disabled={hasReachedConvoLimit}>
            <Link to="/dashboard/ai-chat">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nuevo Chat
            </Link>
          </Button>
          {hasReachedConvoLimit && (
              <p className="text-xs text-destructive text-center mt-2">
                  Límite de 10 chats alcanzado.
              </p>
          )}
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : conversations && conversations.length > 0 ? (
              conversations.map((convo) => (
                <ContextMenu key={convo.id}>
                  <ContextMenuTrigger>
                    <NavLink
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
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => openRenameDialog(convo)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Renombrar
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => openDeleteDialog(convo)}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar este chat?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La conversación se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => convoToDelete && deleteMutation.mutate(convoToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Sí, eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <AlertDialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Renombrar Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Elige un nuevo nombre para esta conversación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Nuevo título del chat"
              onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRenameSubmit} disabled={renameMutation.isPending}>
              {renameMutation.isPending ? 'Guardando...' : 'Guardar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChatHistorySidebar;