import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { es } from '@supabase/auth-ui-shared/dist/esm/locales/es.js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot } from 'lucide-react';

const Login = () => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  if (loading) {
    return (
       <div className="flex items-center justify-center min-h-screen bg-gradient-section">
        <Card className="w-full max-w-md p-8">
          <CardHeader className="p-0 mb-6 text-center">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto mt-2" />
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-px w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (session) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-section p-4">
      <Card className="w-full max-w-md shadow-2xl shadow-primary/10 animate-scale-in border-primary/20">
        <CardHeader className="text-center space-y-4 p-8">
          <div className="mx-auto w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center animate-fade-in" style={{ animationDelay: '100ms' }}>
            <Bot className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '200ms' }}>
            BlueWarriors
          </CardTitle>
          <CardDescription className="text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms' }}>
            Inicia sesión o regístrate para acceder al dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Auth
              supabaseClient={supabase}
              appearance={{ 
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--primary-dark))',
                    },
                  },
                },
              }}
              providers={['google']}
              theme="light"
              localization={{ variables: es }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;