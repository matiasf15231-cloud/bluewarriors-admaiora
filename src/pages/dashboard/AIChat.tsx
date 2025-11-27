import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Sparkles, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import logo from '@/assets/bluewarriors-logo.png';
import { AIInputWithSearch } from '@/components/AIInputWithSearch';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { mutate: sendMessage, isPending, error } = useMutation({
    mutationFn: async (prompt: string) => {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { prompt },
      });
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      return data.response;
    },
    onSuccess: (response) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    },
  });

  const handleSendMessage = (prompt: string, withSearch: boolean) => {
    if (!prompt.trim()) return;
    if (withSearch) {
      toast({
        title: "Búsqueda web no implementada",
        description: "La función de búsqueda web se añadirá pronto.",
      });
    }
    const userMessage: Message = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    sendMessage(prompt);
  };

  const handleFileSelect = (file: File) => {
    toast({
      title: "Subida de archivos no implementada",
      description: `La subida del archivo "${file.name}" no está soportada todavía.`,
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <Card className="flex-1 flex flex-col bg-transparent border-none shadow-none">
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={logo} alt="AI Avatar" />
                      <AvatarFallback><Sparkles /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-md p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isPending && (
                <div className="flex items-start gap-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={logo} alt="AI Avatar" />
                    <AvatarFallback><Sparkles /></AvatarFallback>
                  </Avatar>
                  <div className="max-w-md p-3 rounded-lg bg-secondary flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="border-t">
            {error && (
              <Alert variant="destructive" className="m-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
            <AIInputWithSearch
              onSubmit={handleSendMessage}
              onFileSelect={handleFileSelect}
              placeholder="Habla con el asistente de IA..."
              disabled={isPending}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChat;