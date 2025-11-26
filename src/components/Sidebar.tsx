import { NavLink, useNavigate } from 'react-router-dom';
import { Home, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', icon: Home, text: 'Home' },
    { to: '/dashboard/notes', icon: FileText, text: 'Notas' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          BlueWarriors DB
        </h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary'
              }`
            }
          >
            <link.icon className="h-5 w-5 mr-3" />
            {link.text}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border mt-auto">
        {user && (
          <div className="text-xs text-muted-foreground mb-2 truncate" title={user.email ?? ''}>
            {user.email}
          </div>
        )}
        <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;