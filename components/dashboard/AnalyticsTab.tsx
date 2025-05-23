
import React from 'react';
import SalesChart from './SalesChart';
import ProductsChart from './ProductsChart';

interface AnalyticsTabProps {
  salesData: any[];
  topProducts: any[];
  isLoading: boolean;
}

const AnalyticsTab = ({ salesData, topProducts, isLoading }: AnalyticsTabProps) => {
  return (
    <div className="space-y-6">
      <SalesChart salesData={salesData} isLoading={isLoading} />
      <ProductsChart topProducts={topProducts} isLoading={isLoading} />
    </div>
  );
};

export default AnalyticsTab;
