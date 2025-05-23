
import { supabase } from '@/integrations/supabase/client';

interface SalesData {
  date: string;
  revenue: number;
}

interface TopProduct {
  id: string;
  name: string;
  sales_count: number;
  revenue: number;
}

export const getDashboardStats = async () => {
  try {
    // Get total products count
    const { count: productsCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (productsError) {
      console.error('Error getting products count:', productsError);
    }

    // Get total orders count
    const { count: ordersCount, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (ordersError) {
      console.error('Error getting orders count:', ordersError);
    }

    // Get total revenue
    const { data: orders, error: revenueError } = await supabase
      .from('orders')
      .select('total');

    if (revenueError) {
      console.error('Error getting revenue:', revenueError);
    }

    const totalRevenue = orders?.reduce((acc, order) => acc + order.total, 0) || 0;

    // Get total customers count
    const { count: customersCount, error: customersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (customersError) {
      console.error('Error getting customers count:', customersError);
    }

    // Get pending orders
    const { count: pendingOrdersCount, error: pendingError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingError) {
      console.error('Error getting pending orders count:', pendingError);
    }

    // Get low stock products (less than 10)
    const { count: lowStockCount, error: lowStockError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .lt('stock', 10)
      .gt('stock', 0); // Only count products that have stock > 0

    if (lowStockError) {
      console.error('Error getting low stock products count:', lowStockError);
    }

    // Get recent reviews count in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: recentReviewsCount, error: reviewsError } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (reviewsError) {
      console.error('Error getting recent reviews count:', reviewsError);
    }

    return {
      totalProducts: productsCount || 0,
      totalOrders: ordersCount || 0,
      totalRevenue: totalRevenue,
      totalCustomers: customersCount || 0,
      pendingOrders: pendingOrdersCount || 0,
      lowStockProducts: lowStockCount || 0,
      recentReviews: recentReviewsCount || 0
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      pendingOrders: 0,
      lowStockProducts: 0,
      recentReviews: 0
    };
  }
};

export const getRecentOrders = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        total,
        status,
        created_at,
        user_id
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error getting recent orders:', error);
    return [];
  }
};

export const getTopProducts = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, sales_count, price')
      .order('sales_count', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data?.map(product => ({
      id: product.id,
      name: product.name,
      sales_count: product.sales_count || 0,
      revenue: (product.sales_count || 0) * product.price
    })) || [];
  } catch (error) {
    console.error('Error getting top products:', error);
    return [];
  }
};

export const getSalesOverTime = async (days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('orders')
      .select('created_at, total')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    // Process data to get daily totals
    const salesByDay = new Map();
    
    data?.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0]; // YYYY-MM-DD
      if (!salesByDay.has(date)) {
        salesByDay.set(date, 0);
      }
      salesByDay.set(date, salesByDay.get(date) + order.total);
    });
    
    // Convert to array format for charts
    const salesData: SalesData[] = Array.from(salesByDay.entries()).map(([date, revenue]) => ({
      date,
      revenue
    }));
    
    // Sort by date
    salesData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return salesData;
  } catch (error) {
    console.error('Error getting sales over time:', error);
    return [];
  }
};
