import { useState, useRef, useEffect } from 'react';
import { model } from '@/integrations/gemini/client';
import { PromptBox } from '@/components/PromptBox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import logo from '@/assets/bluewarriors-logo.png';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: '¡Hola! Soy el asistente de IA de BlueWarriors. ¿En qué puedo ayudarte hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();
      const modelMessage: Message = { role: 'model', content: text };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (err) {
      const errorMessage = 'Lo siento, ocurrió un error al contactar a la IA. Por favor, revisa la clave de API o inténtalo de nuevo más tarde.';
      setError(errorMessage);
      setMessages((prev) => [...prev, { role: 'model', content: errorMessage }]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              'flex items-start gap-4',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {msg.role === 'model' && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={logo} alt="BlueWarriors AI" />
                <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'max-w-lg p-3 rounded-2xl whitespace-pre-wrap',
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted text-muted-foreground rounded-bl-none'
              )}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4 justify-start">
            <Avatar className="h-8 w-8">
              <AvatarImage src={logo} alt="BlueWarriors AI" />
              <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div className="max-w-lg p-3 rounded-2xl bg-muted">
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-background border-t">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <PromptBox
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default AiChat;