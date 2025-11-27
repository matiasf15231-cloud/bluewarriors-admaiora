import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DocumentEditor = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-muted">
      <header className="bg-background border-b border-border p-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/documents')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Documentos
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader>
            <CardTitle>Editor en Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              El editor de documentos está temporalmente deshabilitado mientras resolvemos un problema técnico.
              Disculpa las molestias.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DocumentEditor;