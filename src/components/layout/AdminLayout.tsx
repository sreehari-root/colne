
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminMenu from '@/components/AdminMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">Usha Designs</p>
          </div>
          <div className="flex-1 p-4 space-y-1">
            <AdminMenu />
          </div>
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-usha-burgundy text-white grid place-items-center">
                  <User size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.user_metadata?.first_name || 'Admin'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-background">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">Usha Designs</p>
        </div>
        <div className="flex-1 p-4 space-y-1">
          <AdminMenu />
        </div>
        <div className="p-4 border-t mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-usha-burgundy text-white grid place-items-center">
                <User size={14} />
              </div>
              <div>
                <p className="text-sm font-medium">{user?.user_metadata?.first_name || 'Admin'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top header - Mobile only */}
        <header className="md:hidden border-b bg-background p-4">
          <div className="container flex justify-between items-center">
            <h1 className="text-xl font-bold ml-10">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" /> Logout
              </Button>
              <Link to="/" className="text-sm text-usha-burgundy hover:underline flex items-center gap-1">
                View Store
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="flex-1 overflow-auto pt-14 md:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
