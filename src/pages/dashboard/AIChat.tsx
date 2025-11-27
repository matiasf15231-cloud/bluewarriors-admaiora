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

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    } else if (!conversationId) {
      setMessages([]); // Clear messages for a new chat
    }
  }, [initialMessages, conversationId]);

  const { mutate: sendMessage, isPending, error, reset } = useMutation({
    mutationFn: async ({ prompt, currentConversationId }: { prompt: string; currentConversationId: string | undefined }) => {
      let convId = currentConversationId;

      // 1. If it's a new chat, create the conversation first
      if (!convId) {
        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .insert({ user_id: user!.id, title: prompt.substring(0, 40) })
          .select('id')
          .single();
        if (convError) throw new Error(`Failed to create conversation: ${convError.message}`);
        convId = convData.id;
      }

      // 2. Save user message
      const userMessage: Message = { role: 'user', content: prompt };
      const { error: userMsgError } = await supabase.from('messages').insert({
        conversation_id: convId,
        user_id: user!.id,
        ...userMessage,
      });
      if (userMsgError) throw new Error(`Failed to save user message: ${userMsgError.message}`);

      // 3. Call the AI function
      const { data: aiFuncData, error: aiFuncError } = await supabase.functions.invoke('ai-chat', {
        body: { prompt },
      });
      if (aiFuncError) throw new Error(`AI function error: ${aiFuncError.message}`);
      if (aiFuncData.error) throw new Error(`AI logic error: ${aiFuncData.error}`);
      
      const aiResponse = aiFuncData.response;
      const assistantMessage: Message = { role: 'assistant', content: aiResponse };

      // 4. Save assistant message
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
      
      if (!conversationId) {
        navigate(`/dashboard/ai-chat/${newConversationId}`, { replace: true });
      }
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const handleSendMessage = (prompt: string) => {
    if (!prompt.trim()) return;
    reset();
    const userMessage: Message = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    sendMessage({ prompt, currentConversationId: conversationId });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages, isPending]);

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
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={logo} alt="AI Avatar" />
                      <AvatarFallback><Sparkles /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-2xl p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
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
          onSubmit={(prompt) => handleSendMessage(prompt)}
          placeholder="Habla con el asistente de IA..."
          disabled={isPending}
        />
      </div>
    </div>
  );
};

export default AIChat;