import { cn } from "@/lib/utils";
import { NavLink, Link, useNavigate } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import { Menu, X, Home, FileText, LogOut, User, Undo2 } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import logo from '@/assets/bluewarriors-logo.png';

interface Link {
  label: string;
  href: string;
  icon: React.ReactNode;
  end?: boolean;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<"div">) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open } = useSidebar();
  return (
    <div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-card border-r border-border flex-shrink-0",
        open ? "w-[300px]" : "w-[70px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-16 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-card border-b border-border w-full"
        )}
        {...props}
      >
        <div className="flex-1">
          <Link to="/">
            <img src={logo} alt="BlueWarriors Logo" className="h-10" />
          </Link>
        </div>
        <div className="flex justify-end z-20">
          <Menu
            className="text-foreground cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        {open && (
          <div
            className={cn(
              "fixed h-full w-full inset-0 bg-card p-10 z-[100] flex flex-col justify-between",
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-foreground cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <X />
            </div>
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
}: {
  link: Link;
  className?: string;
}) => {
  const { open, setOpen } = useSidebar();

  return (
    <NavLink
      to={link.href}
      end={link.end}
      onClick={() => {
        if (window.innerWidth < 768) {
          setOpen(false);
        }
      }}
      className={({ isActive }) => cn(
        "flex items-center justify-start gap-4 group/sidebar p-3 rounded-lg",
        isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
        className
      )}
    >
      <div className="flex-shrink-0">{link.icon}</div>
      <span
        className={cn(
          "text-sm font-medium whitespace-pre",
          !open && "hidden"
        )}
      >
        {link.label}
      </span>
    </NavLink>
  );
};

export const SidebarContent = () => {
    const { open } = useSidebar();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const mainLinks: Link[] = [
        {
            label: "Home",
            href: "/dashboard",
            icon: <Home className="h-5 w-5" />,
            end: true,
        },
        {
            label: "Documentos",
            href: "/dashboard/documents",
            icon: <FileText className="h-5 w-5" />,
        },
    ];

    const returnLink: Link = {
        label: "Volver al Inicio",
        href: "/",
        icon: <Undo2 className="h-5 w-5" />,
    };

    return (
        <div className={cn("flex flex-col justify-between h-full", open ? "" : "items-center")}>
            <div>
                <div className="px-3 py-2 h-12 flex items-center">
                    <div
                        className={cn(
                            "overflow-hidden",
                            open ? "w-auto" : "w-0"
                        )}
                    >
                        <img src={logo} alt="BlueWarriors Logo" className="h-10" />
                    </div>
                </div>
                <div className="flex flex-col mt-4 w-full space-y-2">
                    {mainLinks.map((link, idx) => (
                        <SidebarLink key={idx} link={link} />
                    ))}
                </div>
            </div>

            <div className="w-full space-y-2">
                <SidebarLink link={returnLink} />
                {user && (
                    <div className={cn(
                        "flex items-center w-full p-2 rounded-lg",
                        open ? "gap-3" : "justify-center"
                    )}>
                        <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email ?? 'User Avatar'} />
                            <AvatarFallback className="bg-muted">
                                <User className="h-4 w-4 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                        <div
                            className={cn(
                                "overflow-hidden flex-1",
                                open ? "w-full" : "w-0"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-foreground truncate" title={user.email ?? ''}>
                                    {user.email}
                                </p>
                                <Button onClick={handleLogout} variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive">
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                <div
                    className={cn(
                        "w-full justify-center mt-2",
                        open ? "hidden" : "flex"
                    )}
                >
                    <Button onClick={handleLogout} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};