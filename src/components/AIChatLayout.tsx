import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarBody, SidebarContent } from './DashboardSidebar';
import ChatHistorySidebar from './ChatHistorySidebar';

const AIChatLayout = () => {
  return (
    <Sidebar>
      <div className="flex h-screen bg-background">
        <SidebarBody>
          <SidebarContent />
        </SidebarBody>
        <ChatHistorySidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </Sidebar>
  );
};

export default AIChatLayout;