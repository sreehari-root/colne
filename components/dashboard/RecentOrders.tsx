
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface RecentOrdersProps {
  recentOrders: any[];
  isLoading: boolean;
}

const RecentOrders = ({ recentOrders, isLoading }: RecentOrdersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground">
            <div>Order</div>
            <div>Status</div>
            <div className="text-right">Amount</div>
          </div>
          <div className="space-y-2">
            {isLoading ? (
              <p className="text-center py-4 text-sm text-muted-foreground">Loading orders...</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-center py-4 text-sm text-muted-foreground">No orders yet</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="grid grid-cols-3 text-sm py-2 border-b">
                  <div>{order.id.slice(0, 8)}</div>
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-right">{formatCurrency(order.total)}</div>
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
