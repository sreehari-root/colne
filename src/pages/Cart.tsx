
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency, calculateDiscountPrice } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    image: string | null;
    price: number;
    discount: number;
    stock: number;
  };
};

export default function Cart() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const fetchCart = async () => {
    setLoading(true);
    
    try {
      // First get the user's cart
      const { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user?.id)
        .single();
      
      if (cartError) {
        if (cartError.code !== 'PGRST116') { // No rows found
          console.error('Error fetching cart:', cartError);
        }
        setCartItems([]);
        setLoading(false);
        return;
      }
      
      // Then get the cart items with product details
      const { data: itemsData, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          id, 
          quantity,
          product:product_id (
            id,
            name,
            image,
            price,
            discount,
            stock
          )
        `)
        .eq('cart_id', cartData.id);
      
      if (itemsError) {
        console.error('Error fetching cart items:', itemsError);
        setCartItems([]);
      } else {
        setCartItems(itemsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);
      
      if (error) {
        console.error('Error updating cart item:', error);
        toast({
          title: "Update failed",
          description: "There was a problem updating your cart",
          variant: "destructive"
        });
      } else {
        // Update local state
        setCartItems(cartItems.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdating(true);
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);
      
      if (error) {
        console.error('Error removing cart item:', error);
        toast({
          title: "Removal failed",
          description: "There was a problem removing the item from your cart",
          variant: "destructive"
        });
      } else {
        // Update local state
        setCartItems(cartItems.filter(item => item.id !== itemId));
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart"
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUpdating(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = calculateDiscountPrice(item.product.price, item.product.discount);
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  const shippingCost = subtotal > 1000 ? 0 : 100;
  const total = subtotal + shippingCost;

  // Redirect if not logged in
  if (!user && !loading) {
    return <Navigate to="/auth" />;
  }

  return (
    <MainLayout>
      <div className="container py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-800">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">Review your items and proceed to checkout</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-usha-burgundy" />
            <span className="ml-2">Loading your cart...</span>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-medium">Cart Items ({cartItems.length})</h2>
                </div>
                <div className="divide-y">
                  {cartItems.map((item) => {
                    const itemPrice = calculateDiscountPrice(item.product.price, item.product.discount);
                    const isOutOfStock = item.product.stock < item.quantity;
                    
                    return (
                      <div key={item.id} className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row">
                          {/* Product image */}
                          <div className="sm:w-24 h-24 flex-shrink-0 bg-white border rounded mb-4 sm:mb-0 flex items-center justify-center">
                            <img 
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              className="max-h-20 max-w-20 object-contain"
                            />
                          </div>
                          
                          {/* Product details */}
                          <div className="sm:ml-6 flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-medium">
                                  <Link 
                                    to={`/product/${item.product.id}`}
                                    className="hover:text-usha-burgundy"
                                  >
                                    {item.product.name}
                                  </Link>
                                </h3>
                                <div className="flex items-center mt-1">
                                  <span className="font-medium text-usha-burgundy">
                                    {formatCurrency(itemPrice)}
                                  </span>
                                  {item.product.discount > 0 && (
                                    <span className="ml-2 text-sm text-muted-foreground line-through">
                                      {formatCurrency(item.product.price)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-3 sm:mt-0 text-right">
                                <span className="font-medium">
                                  {formatCurrency(itemPrice * item.quantity)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center mb-3 sm:mb-0">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                  disabled={updating || item.quantity <= 1}
                                >
                                  -
                                </Button>
                                <Input
                                  className="w-12 h-8 mx-2 text-center"
                                  type="number"
                                  min="1"
                                  max={item.product.stock}
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val) && val > 0) {
                                      updateItemQuantity(item.id, val);
                                    }
                                  }}
                                  disabled={updating}
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                  disabled={updating || item.quantity >= item.product.stock}
                                >
                                  +
                                </Button>
                              </div>
                              
                              <Button
                                variant="ghost"
                                className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeItem(item.id)}
                                disabled={updating}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                            
                            {/* Stock warning */}
                            {isOutOfStock && (
                              <div className="mt-2 flex items-center text-sm text-red-600">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Only {item.product.stock} items available
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Order summary */}
            <div>
              <div className="bg-white rounded-lg border sticky top-8">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-medium">Order Summary</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
                    </span>
                  </div>
                  {subtotal < 1000 && (
                    <div className="text-sm border-t pt-4">
                      <p>Add items worth {formatCurrency(1000 - subtotal)} more for free shipping</p>
                    </div>
                  )}
                  <div className="border-t pt-4 flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span className="text-usha-burgundy">{formatCurrency(total)}</span>
                  </div>
                  <Button 
                    className="w-full bg-usha-burgundy hover:bg-usha-burgundy/90 mt-4"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 bg-gray-50 border-t rounded-b-lg">
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Secure checkout powered by Usha Designs
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-6 flex flex-col items-center justify-center py-16">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
              Looks like you haven't added any items to your cart yet. 
              Explore our collection to discover exclusive designs.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-usha-burgundy hover:bg-usha-burgundy/90"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
