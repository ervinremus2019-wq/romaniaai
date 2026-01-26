import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Cpu, 
  LayoutDashboard, 
  Scale, 
  FileText, 
  LogOut,
  User 
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Strategy Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects Registry", icon: Cpu },
    { href: "/compliance", label: "Compliance Simulator", icon: Scale },
    { href: "/resources", label: "Resources", icon: FileText },
  ];

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-800 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20">
                AI
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-primary leading-tight">
                  Romania AI
                </h1>
                <p className="text-xs text-muted-foreground font-medium tracking-wider">
                  NATIONAL STRATEGY
                </p>
              </div>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => {
                const isActive = location === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`
                      inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200
                      ${isActive 
                        ? "border-accent text-primary" 
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="w-20 h-8 bg-muted animate-pulse rounded" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <User className="w-4 h-4" />
                  {user.firstName || user.username}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => logout()}
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/5"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => window.location.href = "/api/login"} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                Login with Replit
              </Button>
            )}
          </div>

          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-primary hover:bg-gray-100 focus:outline-none"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-border absolute w-full shadow-xl">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="block pl-3 pr-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-5 h-5 text-primary" />
                  {link.label}
                </div>
              </Link>
            ))}
            <div className="pt-4 border-t border-border mt-4">
              {!user ? (
                <Button onClick={() => window.location.href = "/api/login"} className="w-full">
                  Login
                </Button>
              ) : (
                <Button onClick={() => logout()} variant="outline" className="w-full justify-start text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
