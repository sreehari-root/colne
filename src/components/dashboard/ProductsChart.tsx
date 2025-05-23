
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ProductsChartProps {
  topProducts: any[];
  isLoading: boolean;
}

const ProductsChart = ({ topProducts, isLoading }: ProductsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products by Sales</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center py-12 text-muted-foreground">Loading product data...</p>
        ) : topProducts.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">
            No product sales data available yet.
          </p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProducts}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsChart;
