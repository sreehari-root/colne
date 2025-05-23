
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart2,
  Package,
  ShoppingBag,
  Users,
  Star,
  Tag,
  FileText,
  Settings
} from 'lucide-react';

interface AdminMenuProps {
  className?: string;
}

const AdminMenu = ({ className }: AdminMenuProps) => {
  const menuItems = [
    { icon: BarChart2, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: Star, label: 'Reviews', path: '/admin/reviews' },
    { icon: Tag, label: 'Categories', path: '/admin/categories' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' }
  ];

  return (
    <nav className={className}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-muted/50 text-foreground font-medium'
                  : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Icon size={16} />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default AdminMenu;
