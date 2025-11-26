import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarBody, AnimatedSidebarContent } from './AnimatedSidebar';

const DashboardLayout = () => {
  return (
    <Sidebar>
      <div className="flex h-screen bg-background">
        <SidebarBody>
          <AnimatedSidebarContent />
        </SidebarBody>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </Sidebar>
  );
};

export default DashboardLayout;