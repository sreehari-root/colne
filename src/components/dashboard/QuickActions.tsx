
import React, { useState } from 'react';
import { Package, Tag, ShoppingBag, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

// Define a type for the order data we'll fetch for the report
interface OrderReportData {
  id: string;
  customer_name: string;
  customer_email: string;
  order_date: string;
  status: string;
  total_amount: number;
}

const QuickActions = () => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const { toast } = useToast();

  const handleAddProduct = () => {
    window.location.href = '/admin/products?action=add';
  };

  const handleManageCategories = () => {
    window.location.href = '/admin/categories';
  };

  const handleProcessOrders = () => {
    window.location.href = '/admin/orders';
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    toast({
      title: 'Generating Report...',
      description: 'Please wait while we fetch and process the order data.',
    });

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, customer_name, customer_email, order_date, status, total_amount');

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        toast({
          title: 'No Data',
          description: 'No orders found to generate a report.',
          variant: 'default',
        });
        setIsGeneratingReport(false);
        return;
      }

      // Type cast data to ensure correct structure
      const orders = data as OrderReportData[];

      // Define CSV headers
      const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Order Date', 'Status', 'Total Amount'];
      
      // Convert data to CSV rows
      const csvRows = orders.map(order => [
        order.id,
        order.customer_name,
        order.customer_email,
        format(new Date(order.order_date), 'yyyy-MM-dd HH:mm:ss'), // Format date
        order.status,
        order.total_amount.toString()
      ].join(','));

      // Combine headers and rows
      const csvString = [headers.join(','), ...csvRows].join('\n');

      // Create a Blob and trigger download
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'orders_report.csv');
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link); // Clean up
      URL.revokeObjectURL(url);

      toast({
        title: 'Report Generated Successfully',
        description: 'The orders report has been downloaded.',
        variant: 'success',
      });

    } catch (err: any) {
      console.error('Error generating report:', err);
      toast({
        title: 'Error Generating Report',
        description: err.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingReport(false);
    }
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
            disabled={isGeneratingReport}
          >
            <FileText size={24} />
            <span>{isGeneratingReport ? 'Generating...' : 'Generate Report'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
