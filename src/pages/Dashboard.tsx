import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-section p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <Button onClick={handleLogout} variant="destructive">
            Cerrar Sesión
          </Button>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-card">
          <h2 className="text-2xl font-semibold text-primary mb-4">¡Bienvenido!</h2>
          <p className="text-muted-foreground">
            Estás en tu panel de control. Por ahora está en blanco, ¡pero pronto habrá más funcionalidades!
          </p>
          {user && (
            <p className="mt-4 text-sm text-muted-foreground">
              Has iniciado sesión como: {user.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;