
import React from 'react';
import { Package, Tag, ShoppingBag, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QuickActions = () => {
  const handleAddProduct = () => {
    window.location.href = '/admin/products?action=add';
  };

  const handleManageCategories = () => {
    window.location.href = '/admin/categories';
  };

  const handleProcessOrders = () => {
    window.location.href = '/admin/orders';
  };

  const handleGenerateReport = () => {
    alert('Report generation functionality will be implemented soon!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={handleAddProduct}
          >
            <Package size={24} />
            <span>Add Product</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={handleManageCategories}
          >
            <Tag size={24} />
            <span>Manage Categories</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={handleProcessOrders}
          >
            <ShoppingBag size={24} />
            <span>Process Orders</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
            onClick={handleGenerateReport}
          >
            <FileText size={24} />
            <span>Generate Report</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
