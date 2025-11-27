import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';

const DocumentEditor = () => {
  const { id: documentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const isNewDocument = documentId === 'new';

  const { data: documentData, isLoading: isLoadingDocument } = useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      if (isNewDocument || !user) return null;
      const { data, error } = await supabase
        .from('documents')
        .select('title, content')
        .eq('id', documentId)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !isNewDocument && !!user,
  });

  useEffect(() => {
    if (documentData) {
      setTitle(documentData.title || '');
      const docContent = documentData.content;
      // Safely handle content to prevent crashes on null or unexpected formats
      if (docContent && typeof docContent === 'object' && 'markdown' in docContent) {
        setContent(String((docContent as any).markdown || ''));
      } else if (typeof docContent === 'string') { // For backward compatibility
        setContent(docContent);
      } else {
        setContent('');
      }
    }
  }, [documentData]);

  const mutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const contentToSave = { markdown: content };

      if (isNewDocument) {
        const { data, error } = await supabase
          .from('documents')
          .insert({ user_id: user.id, title, content: contentToSave })
          .select('id')
          .single();
        if (error) throw new Error(error.message);
        return { newId: data.id };
      } else {
        const { error } = await supabase
          .from('documents')
          .update({ title, content: contentToSave, updated_at: new Date().toISOString() })
          .eq('id', documentId!);
        if (error) throw new Error(error.message);
        return { newId: null };
      }
    },
    onSuccess: (data) => {
      toast({ title: 'Documento guardado', description: 'Tus cambios han sido guardados.' });
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
      if (data.newId) {
        navigate(`/dashboard/documents/${data.newId}`, { replace: true });
      } else {
        queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      }
    },
    onError: (error) => {
      toast({ title: 'Error al guardar', description: error.message, variant: 'destructive' });
    },
  });

  const handleSave = () => {
    mutation.mutate({ title: title || 'Documento sin título', content });
  };

  if (isLoadingDocument) {
    return (
      <div className="flex flex-col h-screen bg-muted p-8 space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-muted">
      <header className="bg-background border-b border-border p-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/documents')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Documentos
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Guardar
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Título del documento"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold h-12 border-0 focus-visible:ring-0 shadow-none px-0 bg-transparent"
          />
          <Textarea
            placeholder="Escribe tu contenido aquí. Puedes usar Markdown."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 resize-none text-base border rounded-lg p-4 bg-background"
          />
        </div>
        <div className="bg-background rounded-lg border p-4 overflow-y-auto">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{content || "Vista previa..."}</ReactMarkdown>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentEditor;