import { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch messages for the current conversation
  const { isLoading: isLoadingMessages } = useQuery({
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
    onSuccess: (data) => {
      if (!isPending) {
        setMessages(data);
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Effect to handle clearing messages for a new chat
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
    }
  }, [conversationId]);

  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim() || isPending) return;

    setError(null);
    setIsPending(true);

    const userMessage: Message = { role: 'user', content: prompt };
    const assistantMessagePlaceholder: Message = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, userMessage, assistantMessagePlaceholder]);

    let currentConversationId = conversationId;
    let fullResponse = '';

    try {
      // 1. Create conversation if it's a new chat
      if (!currentConversationId) {
        const { data: convData, error: convError } = await supabase
          .from('conversations')
          .insert({ user_id: user!.id, title: prompt.substring(0, 40) })
          .select('id')
          .single();
        if (convError) throw new Error(`Failed to create conversation: ${convError.message}`);
        currentConversationId = convData.id;
        navigate(`/dashboard/ai-chat/${currentConversationId}`, { replace: true });
      }

      // 2. Save user message
      await supabase.from('messages').insert({
        conversation_id: currentConversationId,
        user_id: user!.id,
        ...userMessage,
      });

      // 3. Stream AI response
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch(`https://dfsqcviqgubwkuntwppt.supabase.co/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session?.access_token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(`AI function error: ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1].content = fullResponse;
          }
          return newMessages;
        });
      }

      // 4. Save full assistant response
      await supabase.from('messages').insert({
        conversation_id: currentConversationId,
        user_id: user!.id,
        role: 'assistant',
        content: fullResponse,
      });

      queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });

    } catch (err: any) {
      const errorMessage = err.message || "An unknown error occurred.";
      setError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
      setMessages(prev => prev.slice(0, -2));
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const renderChatContent = () => {
    if (isLoadingMessages) {
      return (
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (messages.length === 0 && !isPending) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-semibold text-foreground">¿En qué puedo ayudarte hoy?</h2>
        </div>
      );
    }

    return (
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
              <div className={`max-w-2xl p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                <ReactMarkdown className="prose dark:prose-invert max-w-none prose-p:m-0 prose-strong:text-inherit">
                  {message.content}
                </ReactMarkdown>
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isPending && messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && messages[messages.length - 1]?.content === '' && (
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
    );
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col bg-transparent border-none shadow-none">
        <CardContent className="flex-1 flex flex-col p-0">
          {renderChatContent()}
          <div className="border-t">
            {error && (
              <Alert variant="destructive" className="m-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <AIInputWithSearch
              onSubmit={(prompt) => handleSendMessage(prompt)}
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