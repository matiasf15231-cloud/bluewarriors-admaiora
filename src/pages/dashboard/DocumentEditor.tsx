import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Bold, Italic, Strikethrough, List, ListOrdered, Heading1, Heading2, Heading3, Quote, Code, Pilcrow, ImageIcon, Loader2 } from 'lucide-react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Toolbar Component, now co-located for better integration
const EditorToolbar = ({ editor, onImageUpload, isNewDocument }: { editor: Editor | null; onImageUpload: (file: File) => Promise<void>; isNewDocument: boolean; }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!editor) {
    return null;
  }

  const handleFileSelect = () => {
    if (isNewDocument) return;
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await onImageUpload(file);
    setIsUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-b border-border p-2 flex flex-wrap items-center gap-1 sticky top-0 bg-card z-10 rounded-t-lg">
      {/* Text Size Toggles */}
      <Toggle size="sm" pressed={editor.isActive('paragraph')} onPressedChange={() => editor.chain().focus().setParagraph().run()}>
        <Pilcrow className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('heading', { level: 1 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('heading', { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('heading', { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="h-4 w-4" />
      </Toggle>
      
      <div className="w-[1px] h-6 bg-border mx-1"></div>

      {/* Style Toggles */}
      <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      
      <div className="w-[1px] h-6 bg-border mx-1"></div>

      {/* List Toggles */}
      <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      
      <div className="w-[1px] h-6 bg-border mx-1"></div>

      {/* Block Toggles */}
      <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('code')} onPressedChange={() => editor.chain().focus().toggleCode().run()}>
        <Code className="h-4 w-4" />
      </Toggle>
      
      <div className="w-[1px] h-6 bg-border mx-1"></div>

      {/* Color Picker */}
      <input
        type="color"
        className="w-6 h-6 p-0 border-none bg-transparent cursor-pointer"
        onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
        value={editor.getAttributes('textStyle').color || '#000000'}
      />

      {/* Image Upload */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>
              <Toggle size="sm" onPressedChange={handleFileSelect} disabled={isNewDocument || isUploading}>
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
              </Toggle>
            </span>
          </TooltipTrigger>
          {isNewDocument && <TooltipContent><p>Guarda el documento para añadir imágenes.</p></TooltipContent>}
        </Tooltip>
      </TooltipProvider>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

interface Document {
  id: string;
  title: string;
  content: any;
}

const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        renderHTML: (attributes) => ({
          style: `width: ${attributes.width}`,
        }),
        parseHTML: (element) => element.style.width || element.getAttribute('width'),
      },
    };
  },
}).configure({
  inline: false,
});

const DocumentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [title, setTitle] = useState('');

  const isNewDocument = id === 'new';

  const { data: documentData, isLoading } = useQuery<Document | null>({
    queryKey: ['document', id],
    queryFn: async () => {
      if (isNewDocument || !id) return null;
      const { data, error } = await supabase.from('documents').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !isNewDocument && !!id,
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }), 
      TextStyle, 
      Color,
      ResizableImage,
    ],
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-full focus:outline-none min-h-[400px] prose-p:my-2 prose-h1:my-4 prose-h2:my-3 prose-h3:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:my-3',
      },
    },
  });

  useEffect(() => {
    if (documentData) {
      setTitle(documentData.title || '');
      if (editor && documentData.content && !editor.isDestroyed) {
        const currentContent = JSON.stringify(editor.getJSON());
        const newContent = JSON.stringify(documentData.content);
        if (currentContent !== newContent) {
          editor.commands.setContent(documentData.content);
        }
      }
    } else if (isNewDocument && editor && !editor.isDestroyed) {
      editor.commands.clearContent();
    }
  }, [documentData, editor, isNewDocument]);

  const documentMutation = useMutation({
    mutationFn: async ({ title, content }: { title: string; content: any }) => {
      if (!user) throw new Error('User not authenticated');
      const docPayload = { user_id: user.id, title, content };

      if (isNewDocument) {
        const { data, error } = await supabase.from('documents').insert(docPayload).select().single();
        if (error) throw new Error(error.message);
        return data;
      } else {
        const { data, error } = await supabase.from('documents').update(docPayload).eq('id', id!).select().single();
        if (error) throw new Error(error.message);
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
      queryClient.setQueryData(['document', data.id], data);
      toast({ title: '¡Documento guardado!' });
      if (isNewDocument && data) {
        navigate(`/dashboard/documents/${data.id}`, { replace: true });
      }
    },
    onError: (error) => {
      toast({ title: 'Error al guardar', description: error.message, variant: 'destructive' });
    },
  });

  const handleSave = () => {
    if (!editor) return;
    documentMutation.mutate({ title, content: editor.getJSON() });
  };

  const handleImageUpload = async (file: File) => {
    if (!editor || !user || isNewDocument || !id) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Archivo no válido', description: 'Por favor, selecciona un archivo de imagen.', variant: 'destructive' });
      return;
    }
    if (file.size > 20 * 1024 * 1024) { // 20MB
      toast({ title: 'Archivo demasiado grande', description: 'El tamaño máximo de la imagen es de 20MB.', variant: 'destructive' });
      return;
    }

    let imageCount = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'image') imageCount += 1;
    });
    if (imageCount >= 10) {
      toast({ title: 'Límite de imágenes alcanzado', description: 'No puedes añadir más de 10 imágenes por documento.', variant: 'destructive' });
      return;
    }

    try {
      const filePath = `${user.id}/${id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('document_images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('document_images').getPublicUrl(filePath);
      if (!publicUrl) throw new Error('No se pudo obtener la URL de la imagen.');

      editor.chain().focus().setImage({ src: publicUrl }).run();
    } catch (error: any) {
      toast({ title: 'Error al subir la imagen', description: error.message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-muted">
        <header className="bg-background border-b border-border p-2 flex items-center justify-between flex-shrink-0">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
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
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {documentMutation.isPending ? 'Guardando...' : 'Guardado'}
          </p>
          <Button size="sm" onClick={handleSave} disabled={documentMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-lg border border-border">
          <EditorToolbar editor={editor} onImageUpload={handleImageUpload} isNewDocument={isNewDocument} />
          <div className="p-8 md:p-12">
            <Input
              placeholder="Título del Documento"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-none text-3xl md:text-5xl font-bold h-auto p-0 focus-visible:ring-0 mb-8 w-full bg-transparent"
            />
            {editor && (
              <BubbleMenu
                editor={editor}
                tippyOptions={{ duration: 100 }}
                shouldShow={({ editor }) => editor.isActive('image')}
                className="bg-card border border-border rounded-lg shadow-xl p-1 flex gap-1"
              >
                <Button
                  size="sm"
                  variant={editor.isActive('image', { width: '25%' }) ? 'secondary' : 'ghost'}
                  onClick={() => editor.chain().focus().updateAttributes('image', { width: '25%' }).run()}
                >
                  Pequeño
                </Button>
                <Button
                  size="sm"
                  variant={editor.isActive('image', { width: '50%' }) ? 'secondary' : 'ghost'}
                  onClick={() => editor.chain().focus().updateAttributes('image', { width: '50%' }).run()}
                >
                  Mediano
                </Button>
                <Button
                  size="sm"
                  variant={editor.isActive('image', { width: '100%' }) ? 'secondary' : 'ghost'}
                  onClick={() => editor.chain().focus().updateAttributes('image', { width: '100%' }).run()}
                >
                  Grande
                </Button>
              </BubbleMenu>
            )}
            <EditorContent editor={editor} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentEditor;