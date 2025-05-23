
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Re-using OrderStatus type, simplified Order type for this component
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface RecentOrder {
  id: string;
  status: OrderStatus;
  total_amount: number;
  order_date: string; // Keep as string for simplicity, or Date if conversion is handled
}

const RecentOrders = () => {
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from('orders')
          .select('id, status, total_amount, order_date') // Select only needed fields
          .order('order_date', { ascending: false })
          .limit(5);

        if (supabaseError) {
          throw supabaseError;
        }
        
        // Map data to ensure correct types, especially for status
        const mappedData: RecentOrder[] = data.map(order => ({
            ...order,
            status: order.status as OrderStatus, // Cast status to OrderStatus
            total_amount: order.total_amount,
        }));
        setRecentOrders(mappedData);

      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch recent orders.';
        setError(errorMessage);
        toast({
          title: "Error Fetching Recent Orders",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentOrders();
  }, [toast]);

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground">
            <div>Order ID</div>
            <div>Status</div>
            <div className="text-right">Amount</div>
          </div>
          <div className="space-y-2">
            {isLoading ? (
              <p className="text-center py-4 text-sm text-muted-foreground">Loading orders...</p>
            ) : error ? (
              <p className="text-center py-4 text-sm text-red-600">Error: {error}</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-center py-4 text-sm text-muted-foreground">No recent orders found.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="grid grid-cols-3 text-sm py-2 border-b last:border-b-0">
                  <div>{order.id.slice(-8)}</div> {/* Show last 8 chars of ID */}
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">{formatCurrency(order.total_amount)}</div>
                </div>
              ))
            )}
          </div>
          <Button
            variant="outline"
            className="w-full"
            size="sm"
            onClick={() => window.location.href = '/admin/orders'}
          >
            View All Orders
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
