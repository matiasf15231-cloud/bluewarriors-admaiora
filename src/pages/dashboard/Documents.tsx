import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, MoreVertical, Edit, Trash2, AlertTriangle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Document {
  id: string;
  title: string;
  updated_at: string;
}

const Documents = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);

  // Fetch documents
  const { data: documents, isLoading, isError } = useQuery<Document[]>({
    queryKey: ['documents', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('documents')
        .select('id, title, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (docId: string) => {
      const { error } = await supabase.from('documents').delete().eq('id', docId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
      toast({
        title: 'Documento eliminado',
        description: 'El documento ha sido eliminado permanentemente.',
      });
      setIsDeleteDialogOpen(false);
      setDocToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Error al eliminar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const openDeleteDialog = (doc: Document) => {
    setDocToDelete(doc);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-foreground">Documentos</h1>
        <Button onClick={() => navigate('/dashboard/documents/new')}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Crear Documento
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-destructive">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p>Error al cargar los documentos. Por favor, intenta de nuevo.</p>
        </div>
      )}

      {!isLoading && !isError && documents?.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <h3 className="text-xl font-semibold text-foreground">No tienes documentos todavía</h3>
          <p className="text-muted-foreground mt-2 mb-4">¡Crea tu primer documento para empezar!</p>
          <Button onClick={() => navigate('/dashboard/documents/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Crear mi primer documento
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents?.map((doc) => (
          <Card
            key={doc.id}
            className="flex flex-col hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => navigate(`/dashboard/documents/${doc.id}`)}
          >
            <CardHeader className="flex-row items-start justify-between w-full">
              <div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{doc.title || 'Documento sin título'}</CardTitle>
                <CardDescription>
                  Actualizado hace {formatDistanceToNow(new Date(doc.updated_at), { locale: es })}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/documents/${doc.id}`);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteDialog(doc);
                    }}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar este documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El documento se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => docToDelete && deleteMutation.mutate(docToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Sí, eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Documents;