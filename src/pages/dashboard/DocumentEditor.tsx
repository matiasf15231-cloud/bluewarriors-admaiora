import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Tiptap from '@/components/editor/Tiptap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  content: any;
}

const DocumentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const isNewDocument = id === 'new';

  // Fetch document data
  const { data: documentData, isLoading } = useQuery<Document | null>({
    queryKey: ['document', id],
    queryFn: async () => {
      if (isNewDocument || !id) return null;
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !isNewDocument && !!id,
  });

  useEffect(() => {
    if (documentData) {
      setTitle(documentData.title || '');
      setContent(documentData.content ? JSON.stringify(documentData.content) : '');
    }
  }, [documentData]);

  // Mutation for creating/updating document
  const documentMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: any }) => {
      if (!user) throw new Error('User not authenticated');

      const docPayload = {
        user_id: user.id,
        title,
        content: content ? JSON.parse(content) : null,
      };

      if (isNewDocument) {
        // Create new document
        const { data, error } = await supabase.from('documents').insert(docPayload).select().single();
        if (error) throw new Error(error.message);
        return data;
      } else {
        // Update existing document
        const { data, error } = await supabase.from('documents').update(docPayload).eq('id', id!).select().single();
        if (error) throw new Error(error.message);
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['document', id] });
      toast({
        title: '¡Documento guardado!',
        description: 'Tus cambios se han guardado correctamente.',
      });
      if (isNewDocument && data) {
        navigate(`/dashboard/documents/${data.id}`, { replace: true });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error al guardar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    documentMutation.mutate({ title, content });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => navigate('/dashboard/documents')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Documentos
        </Button>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">
            {isNewDocument ? 'Nuevo Documento' : 'Editar Documento'}
          </h1>
          <Button onClick={handleSave} disabled={documentMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {documentMutation.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
      <Input
        placeholder="Título del documento"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl font-bold h-12"
      />
      <Tiptap content={content ? JSON.parse(content) : ''} onChange={setContent} />
    </div>
  );
};

export default DocumentEditor;