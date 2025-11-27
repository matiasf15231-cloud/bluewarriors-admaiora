import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Loader2, AlertTriangle } from 'lucide-react';
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

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_MEDIA_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];

const mediaSchema = z.object({
  title: z.string().min(3, { message: 'El título es requerido.' }),
  description: z.string().optional(),
  category: z.string({ required_error: 'La categoría es requerida.' }),
  file: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Debes seleccionar un archivo.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo es 50MB.`)
    .refine(
      (files) => ACCEPTED_MEDIA_TYPES.includes(files?.[0]?.type),
      'Formato no soportado. Sube imágenes (JPG, PNG) o videos (MP4, MOV).'
    ),
});

type MediaFormValues = z.infer<typeof mediaSchema>;

interface GalleryMedia {
  id: string;
  public_url: string;
  title: string;
  type: 'photo' | 'video';
  file_path: string;
}

const categories = [
  { id: 'eventos', name: 'Eventos' },
  { id: 'excursiones', name: 'Excursiones' },
  { id: 'profesionales', name: 'Sesiones con Profesionales' },
  { id: 'mesa', name: 'Mesa' },
  { id: 'misiones', name: 'Misiones' },
];

const GalleryManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<GalleryMedia | null>(null);

  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
  });

  const { data: media, isLoading, isError } = useQuery<GalleryMedia[]>({
    queryKey: ['gallery_media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_media')
        .select('id, public_url, title, type, file_path')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (values: MediaFormValues) => {
      if (!user) throw new Error('Usuario no autenticado');
      const file = values.file[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, file);
      if (uploadError) throw new Error(`Error al subir archivo: ${uploadError.message}`);

      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('gallery_media').insert({
        user_id: user.id,
        file_path: filePath,
        public_url: publicUrl,
        title: values.title,
        description: values.description,
        category: values.category,
        type: file.type.startsWith('image') ? 'photo' : 'video',
      });
      if (dbError) throw new Error(`Error al guardar en base de datos: ${dbError.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery_media'] });
      toast({ title: '¡Éxito!', description: 'El archivo se ha subido a la galería.' });
      form.reset();
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (mediaItem: GalleryMedia) => {
      const { error: storageError } = await supabase.storage.from('gallery').remove([mediaItem.file_path]);
      if (storageError) throw new Error(`Error al eliminar archivo: ${storageError.message}`);

      const { error: dbError } = await supabase.from('gallery_media').delete().eq('id', mediaItem.id);
      if (dbError) throw new Error(`Error al eliminar de base de datos: ${dbError.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery_media'] });
      toast({ title: 'Eliminado', description: 'El archivo ha sido eliminado de la galería.' });
      setIsDeleteDialogOpen(false);
      setMediaToDelete(null);
    },
    onError: (error) => {
      toast({ title: 'Error al eliminar', description: error.message, variant: 'destructive' });
    },
  });

  const onSubmit = (values: MediaFormValues) => {
    uploadMutation.mutate(values);
  };

  const openDeleteDialog = (mediaItem: GalleryMedia) => {
    setMediaToDelete(mediaItem);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-foreground">Gestionar Galería</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Subir Nuevo Archivo</CardTitle>
          <CardDescription>Añade una nueva foto o video a la galería pública.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl><Input placeholder="Ej: Equipo en la competencia" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (Opcional)</FormLabel>
                  <FormControl><Textarea placeholder="Describe la foto o video..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="file" render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Archivo</FormLabel>
                  <FormControl>
                    <Input type="file" accept={ACCEPTED_MEDIA_TYPES.join(',')} onChange={(e) => onChange(e.target.files)} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={uploadMutation.isPending}>
                {uploadMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <PlusCircle className="h-4 w-4 mr-2" />}
                Subir a la Galería
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Galería Actual</h2>
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
          </div>
        )}
        {isError && (
          <div className="text-center py-12 text-destructive"><AlertTriangle className="h-12 w-12 mx-auto mb-4" /><p>Error al cargar la galería.</p></div>
        )}
        {!isLoading && !isError && media?.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg"><p className="text-muted-foreground">La galería está vacía. ¡Sube el primer archivo!</p></div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media?.map((item) => (
            <div key={item.id} className="relative group">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                {item.type === 'photo' ? (
                  <img src={item.public_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <video src={item.public_url} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end">
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => openDeleteDialog(item)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-white text-sm font-semibold truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. El archivo se eliminará permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => mediaToDelete && deleteMutation.mutate(mediaToDelete)} className="bg-destructive hover:bg-destructive/90" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Eliminando...' : 'Sí, eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GalleryManagement;