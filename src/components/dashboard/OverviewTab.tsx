
import React from 'react';
import RecentOrders from './RecentOrders';
import PopularProducts from './PopularProducts';
import QuickActions from './QuickActions';

interface OverviewTabProps {
  recentOrders: any[];
  topProducts: any[];
  isLoading: boolean;
}

const OverviewTab = ({ recentOrders, topProducts, isLoading }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders recentOrders={recentOrders} isLoading={isLoading} />
        <PopularProducts topProducts={topProducts} isLoading={isLoading} />
      </div>
      <QuickActions />
    </div>
  );
};

export default OverviewTab;
