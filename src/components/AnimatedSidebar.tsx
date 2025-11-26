import { cn } from "@/lib/utils";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Home, FileText, LogOut, User, Undo2 } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Link {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
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
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-card border-r border-border w-[300px] flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "70px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
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
          <Link to="/" className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            BlueWarriors DB
          </Link>
        </div>
        <div className="flex justify-end z-20">
          <Menu
            className="text-foreground cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
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
            </motion.div>
          )}
        </AnimatePresence>
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
  const { open, animate, setOpen } = useSidebar();
  const location = useLocation();
  const isActive = location.pathname === link.href;

  return (
    <NavLink
      to={link.href}
      onClick={() => setOpen(false)}
      className={cn(
        "flex items-center justify-start gap-4 group/sidebar p-3 rounded-lg",
        isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
        className
      )}
    >
      <div className="flex-shrink-0">{link.icon}</div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm font-medium group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </NavLink>
  );
};

export const AnimatedSidebarContent = () => {
    const { open } = useSidebar();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const links = [
        {
            label: "Volver al Inicio",
            href: "/",
            icon: <Undo2 className="h-5 w-5" />,
        },
        {
            label: "Home",
            href: "/dashboard",
            icon: <Home className="h-5 w-5" />,
        },
        {
            label: "Notas",
            href: "/dashboard/notes",
            icon: <FileText className="h-5 w-5" />,
        },
    ];

    return (
        <div className={cn("flex flex-col justify-between h-full", open ? "" : "items-center")}>
            <div className="flex flex-col flex-1 mt-8 w-full space-y-2">
                {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                ))}
            </div>

            <div className="w-full">
                {user && (
                    <div className={cn(
                        "flex items-center w-full p-2 rounded-lg transition-colors duration-200",
                        open ? "gap-3" : "justify-center"
                    )}>
                        <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email ?? 'User Avatar'} />
                            <AvatarFallback className="bg-muted">
                                <User className="h-4 w-4 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                        <motion.div
                            animate={{
                                width: open ? "100%" : 0,
                                opacity: open ? 1 : 0,
                            }}
                            className="overflow-hidden flex-1"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-foreground truncate" title={user.email ?? ''}>
                                    {user.email}
                                </p>
                                <Button onClick={handleLogout} variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive">
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
                <motion.div
                    animate={{
                        display: open ? "none" : "flex",
                        opacity: open ? 0 : 1,
                    }}
                    className="w-full justify-center mt-2"
                >
                    <Button onClick={handleLogout} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};