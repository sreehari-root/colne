
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface CustomerType {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
  orders_count?: number;
  total_spent?: number;
  last_order_date?: string;
}

export const fetchCustomers = async (): Promise<CustomerType[]> => {
  try {
    // First get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      throw profilesError;
    }

    if (!profiles || profiles.length === 0) {
      return [];
    }

    // Get auth users data for email (requires admin privileges)
    // In a real app with proper admin rights, you would join this information
    
    // Get orders information for each user
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('user_id, total, created_at');

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
    }

    // Process orders data
    const customerStats = new Map();
    
    if (orders && orders.length > 0) {
      orders.forEach(order => {
        if (!customerStats.has(order.user_id)) {
          customerStats.set(order.user_id, {
            orders_count: 0,
            total_spent: 0,
            last_order_date: null
          });
        }
        
        const stats = customerStats.get(order.user_id);
        stats.orders_count += 1;
        stats.total_spent += order.total;
        
        const orderDate = new Date(order.created_at);
        if (!stats.last_order_date || orderDate > new Date(stats.last_order_date)) {
          stats.last_order_date = order.created_at;
        }
      });
    }

    // Combine the data
    const customers = profiles.map(profile => {
      const stats = customerStats.get(profile.id) || {
        orders_count: 0,
        total_spent: 0,
        last_order_date: null
      };
      
      return {
        ...profile,
        email: '', // In a real app with proper admin rights, you would get this from auth.users
        orders_count: stats.orders_count,
        total_spent: stats.total_spent,
        last_order_date: stats.last_order_date
      };
    });

    return customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

export const getCustomerOrders = async (customerId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        total,
        status,
        created_at,
        order_items (
          id,
          product_id,
          quantity,
          price,
          products:product_id (name)
        )
      `)
      .eq('user_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return [];
  }
};
