
import React from 'react';
import { ShoppingBag, Users, Package, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface DashboardStatsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    pendingOrders: number;
    lowStockProducts: number;
    recentReviews: number;
  };
  salesData: any[];
  isLoading: boolean;
}

const DashboardStats = ({ stats, salesData, isLoading }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalOrders}</div>
            <div className="h-12 w-12 rounded-full bg-usha-burgundy/10 text-usha-burgundy grid place-items-center">
              <ShoppingBag />
            </div>
          </div>
          {stats.pendingOrders > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {stats.pendingOrders} pending orders
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {isLoading ? '...' : formatCurrency(stats.totalRevenue)}
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 grid place-items-center">
              <BarChart2 />
            </div>
          </div>
          {salesData.length > 1 && (
            <p className="text-xs text-muted-foreground mt-2">
              {salesData[salesData.length - 1].revenue > salesData[salesData.length - 2].revenue ? '+' : '-'}
              {Math.abs(salesData[salesData.length - 1].revenue - salesData[salesData.length - 2].revenue).toLocaleString('en-IN')} from previous day
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalCustomers}</div>
            <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 grid place-items-center">
              <Users />
            </div>
          </div>
          {stats.recentReviews > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {stats.recentReviews} new reviews in the last 30 days
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalProducts}</div>
            <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 grid place-items-center">
              <Package />
            </div>
          </div>
          {stats.lowStockProducts > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {stats.lowStockProducts} items low in stock
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
