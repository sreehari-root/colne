
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import OverviewTab from '@/components/dashboard/OverviewTab';
import AnalyticsTab from '@/components/dashboard/AnalyticsTab';
import {
  getDashboardStats,
  getRecentOrders,
  getTopProducts,
  getSalesOverTime
} from '@/lib/api/analytics';

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    recentReviews: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsData, ordersData, productsData, salesTimeData] = await Promise.all([
          getDashboardStats(),
          getRecentOrders(),
          getTopProducts(),
          getSalesOverTime()
        ]);
        
        setStats(statsData);
        setRecentOrders(ordersData);
        setTopProducts(productsData);
        setSalesData(salesTimeData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <AdminLayout>
      {/* Top header */}
      <header className="border-b bg-background p-4">
        <div className="container flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Settings size={16} className="mr-2" /> Settings
            </Button>
            <Link to="/" className="text-sm text-usha-burgundy hover:underline flex items-center gap-1">
              <Eye size={16} /> View Store
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="container">
          <DashboardStats stats={stats} salesData={salesData} isLoading={isLoading} />

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <OverviewTab 
                recentOrders={recentOrders} 
                topProducts={topProducts} 
                isLoading={isLoading} 
              />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <AnalyticsTab 
                salesData={salesData} 
                topProducts={topProducts} 
                isLoading={isLoading} 
              />
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-12">
                    Sales reports, inventory reports, and other business analytics will be shown here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-12">
                    System notifications, alerts, and messages will appear in this section.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}
