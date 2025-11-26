import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarBody, SidebarContent } from './DashboardSidebar';

const DashboardLayout = () => {
  return (
    <Sidebar>
      <div className="flex h-screen bg-background">
        <SidebarBody>
          <SidebarContent />
        </SidebarBody>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </Sidebar>
  );
};

export default DashboardLayout;