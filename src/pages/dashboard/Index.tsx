import { useAuth } from '@/contexts/AuthContext';

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-4xl font-bold text-foreground mb-8">Home</h1>
      <div className="bg-card p-6 rounded-lg shadow-card">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          ¡Bienvenido al Dashboard!
        </h2>
        <p className="text-muted-foreground">
          Este es tu panel de control. Desde aquí podrás acceder a tus notas, códigos y otra información importante para el equipo.
        </p>
        {user && (
          <p className="mt-4 text-sm text-muted-foreground">
            Has iniciado sesión como: {user.email}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;