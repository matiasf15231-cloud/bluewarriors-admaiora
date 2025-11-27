import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Sparkles, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import logo from '@/assets/bluewarriors-logo.png';
import { AIInputWithSearch } from '@/components/AIInputWithSearch';
import { useToast } from '@/hooks/use-toast';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { CopyButton } from '@/components/CopyButton';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChat = () => {
  const { user } = useAuth();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch messages for the current conversation
  const { data: initialMessages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId || !user) return [];
      const { data, error } = await supabase
        .from('messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (error) throw new Error(error.message);
      return data as Message[];
    },
    enabled: !!conversationId && !!user,
  });

  // Query for daily message count
  const { data: dailyMessageCount, isLoading: isLoadingCount } = useQuery({
    queryKey: ['dailyMessageCount', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('role', 'user')
        .gte('created_at', today.toISOString());
      if (error) {
        console.error("Error fetching daily message count:", error);
        return 0;
      }
      return count ?? 0;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    } else if (!conversationId) {
      setMessages([]);
    }
  }, [initialMessages, conversationId]);

  const { mutate: sendMessage, isPending, error, reset } = useMutation({
    mutationFn: async ({ prompt, currentConversationId, history }: { prompt: string; currentConversationId: string | undefined; history: Message[] }) => {
      // Re-check limits inside mutation for accuracy
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const { count: messageCount, error: messageError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id)
        .eq('role', 'user')
        .gte('created_at', today.toISOString());

      if (messageError) throw new Error(`Error al verificar el límite de mensajes: ${messageError.message}`);
      if (messageCount !== null && messageCount >= 20) {
        throw new Error('Has alcanzado el límite de 20 mensajes por día.');
      }

      let convId = currentConversationId;

      if (!convId) {
        const { count: convoCount, error: convoError } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user!.id);
        
        if (convoError) throw new Error(`Error al verificar el límite de chats: ${convoError.message}`);
        if (convoCount !== null && convoCount >= 10) {
          throw new Error('Has alcanzado el límite de 10 chats. Elimina uno para crear uno nuevo.');
        }

        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .insert({ user_id: user!.id, title: prompt.substring(0, 40) })
          .select('id')
          .single();
        if (convError) throw new Error(`Failed to create conversation: ${convError.message}`);
        convId = convData.id;
      }

      const userMessage: Message = { role: 'user', content: prompt };
      const { error: userMsgError } = await supabase.from('messages').insert({
        conversation_id: convId,
        user_id: user!.id,
        ...userMessage,
      });
      if (userMsgError) throw new Error(`Failed to save user message: ${userMsgError.message}`);

      const { data: aiFuncData, error: aiFuncError } = await supabase.functions.invoke('ai-chat', {
        body: { prompt, history },
      });
      
      if (aiFuncError) {
        const specificError = aiFuncError.context?.error || aiFuncError.message;
        throw new Error(specificError);
      }
      if (aiFuncData.error) {
        throw new Error(aiFuncData.error);
      }
      
      const aiResponse = aiFuncData.response;
      const assistantMessage: Message = { role: 'assistant', content: aiResponse };

      const { error: assistantMsgError } = await supabase.from('messages').insert({
        conversation_id: convId,
        user_id: user!.id,
        ...assistantMessage,
      });
      if (assistantMsgError) throw new Error(`Failed to save assistant message: ${assistantMsgError.message}`);

      return { newConversationId: convId, assistantMessage };
    },
    onSuccess: ({ newConversationId, assistantMessage }) => {
      setMessages((prev) => [...prev, assistantMessage]);
      queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dailyMessageCount', user?.id] });
      
      if (!conversationId) {
        navigate(`/dashboard/ai-chat/${newConversationId}`, { replace: true });
      }
    },
    onError: (err) => {
      toast({ title: "Error del Asistente IA", description: err.message, variant: "destructive" });
    }
  });

  const handleSendMessage = (prompt: string) => {
    if (!prompt.trim()) return;
    reset();
    const userMessage: Message = { role: 'user', content: prompt };
    const currentHistory = [...messages];
    setMessages((prev) => [...prev, userMessage]);
    sendMessage({ prompt, currentConversationId: conversationId, history: currentHistory });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado al portapapeles",
      });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        title: "Error al copiar",
        variant: "destructive",
      });
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages, isPending]);

  const messagesRemaining = 20 - (dailyMessageCount ?? 0);
  const hasReachedDailyLimit = messagesRemaining <= 0;
  const isInputDisabled = isPending || hasReachedDailyLimit;

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-6">
          {isLoadingMessages ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 && !isPending ? (
            <div className="flex h-full flex-col items-center justify-center text-center min-h-[calc(100vh-200px)]">
              <h2 className="text-2xl font-semibold text-foreground">¿En qué puedo ayudarte hoy?</h2>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => {
                if (message.role === 'user') {
                  return (
                    <div key={index} className="flex items-start gap-4 justify-end">
                      <div className="max-w-2xl p-3 rounded-lg bg-primary text-primary-foreground">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback><User /></AvatarFallback>
                      </Avatar>
                    </div>
                  );
                }
                return (
                  <div key={index} className="flex items-start gap-4">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={logo} alt="AI Avatar" />
                      <AvatarFallback><Sparkles /></AvatarFallback>
                    </Avatar>
                    <div className="group relative max-w-2xl rounded-lg bg-secondary">
                      <div className="prose prose-sm dark:prose-invert max-w-none p-3 pr-10">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      <CopyButton
                        onClick={() => handleCopy(message.content)}
                        className="absolute top-1 right-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                );
              })}
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
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <AIInputWithSearch
          onSubmit={(prompt) => handleSendMessage(prompt)}
          placeholder={hasReachedDailyLimit ? "Límite diario de mensajes alcanzado" : "Habla con el asistente de IA..."}
          disabled={isInputDisabled}
        />
        <div className="text-center text-xs text-muted-foreground mt-2">
          {isLoadingCount ? (
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          ) : (
            <p>
              {messagesRemaining > 0 ? `Te quedan ${messagesRemaining} mensajes hoy.` : "Has agotado tus mensajes de hoy."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChat;