
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface PopularProductsProps {
  topProducts: any[];
  isLoading: boolean;
}

const PopularProducts = ({ topProducts, isLoading }: PopularProductsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-6 text-sm font-medium text-muted-foreground">
            <div className="col-span-3">Product</div>
            <div>Sales</div>
            <div className="text-right col-span-2">Revenue</div>
          </div>
          <div className="space-y-2">
            {isLoading ? (
              <p className="text-center py-4 text-sm text-muted-foreground">Loading products...</p>
            ) : topProducts.length === 0 ? (
              <p className="text-center py-4 text-sm text-muted-foreground">No products data yet</p>
            ) : (
              topProducts.map((product) => (
                <div key={product.id} className="grid grid-cols-6 text-sm py-2 border-b">
                  <div className="col-span-3 truncate">
                    {product.name}
                  </div>
                  <div>{product.sales_count}</div>
                  <div className="text-right col-span-2">{formatCurrency(product.revenue)}</div>
                </div>
              ))
            )}
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
            onClick={() => window.location.href = '/admin/products'}
          >
            View All Products
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularProducts;
