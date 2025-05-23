
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, User, Package, Heart, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
};

type Order = {
  id: string;
  status: string;
  total: number;
  created_at: string;
};

type WishlistItem = {
  id: string;
  products: {
    id: string;
    name: string;
    image: string | null;
    price: number;
    discount: number;
  };
};

export default function Account() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else if (profileData) {
        setProfile(profileData);
        setFirstName(profileData.first_name || '');
        setLastName(profileData.last_name || '');
        setPhone(profileData.phone || '');
        setAddress(profileData.address || '');
      }
      
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
      } else {
        setOrders(ordersData || []);
      }
      
      // Fetch wishlist
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select(`
          id, 
          products:product_id (
            id, 
            name, 
            image, 
            price, 
            discount
          )
        `)
        .eq('user_id', user?.id);
        
      if (wishlistError) {
        console.error('Error fetching wishlist:', wishlistError);
      } else {
        setWishlist(wishlistData || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone,
          address
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
      
      // Update local profile state
      if (profile) {
        setProfile({
          ...profile,
          first_name: firstName,
          last_name: lastName,
          phone,
          address
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  // Redirect if not logged in
  if (authLoading) {
    return (
      <MainLayout>
        <div className="container py-12 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-usha-burgundy" />
            <p className="mt-4 text-lg">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <MainLayout>
      <div className="container py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-800">My Account</h1>
          <p className="text-muted-foreground mt-2">Manage your profile and view your orders</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg border text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src="" />
                <AvatarFallback className="bg-usha-burgundy text-white text-lg">
                  {firstName?.charAt(0)}{lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-medium text-lg">{profile?.first_name} {profile?.last_name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <Tabs defaultValue="profile">
              <TabsList className="w-full grid grid-cols-3 mb-8">
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">My Profile</span>
                  <span className="sm:hidden">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <Package className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">My Orders</span>
                  <span className="sm:hidden">Orders</span>
                </TabsTrigger>
                <TabsTrigger value="wishlist">
                  <Heart className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">My Wishlist</span>
                  <span className="sm:hidden">Wishlist</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your account details and preferences
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={updateProfile}>
                    <CardContent className="space-y-4">
                      {loading ? (
                        <div className="flex justify-center p-6">
                          <Loader2 className="h-8 w-8 animate-spin text-usha-burgundy" />
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="first-name">First Name</Label>
                              <Input
                                id="first-name"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="last-name">Last Name</Label>
                              <Input
                                id="last-name"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={user.email || ''}
                              disabled
                              className="bg-gray-50"
                            />
                            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              placeholder="Phone number"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              placeholder="Your address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="bg-usha-burgundy hover:bg-usha-burgundy/90"
                        disabled={loading || updating}
                      >
                        {updating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View your recent orders and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center p-6">
                        <Loader2 className="h-8 w-8 animate-spin text-usha-burgundy" />
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2">Order ID</th>
                              <th className="text-left py-3 px-2">Date</th>
                              <th className="text-left py-3 px-2">Status</th>
                              <th className="text-left py-3 px-2">Total</th>
                              <th className="text-right py-3 px-2">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <tr key={order.id} className="border-b">
                                <td className="py-3 px-2 text-sm">
                                  #{order.id.split('-')[0]}
                                </td>
                                <td className="py-3 px-2 text-sm">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-2 text-sm">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </td>
                                <td className="py-3 px-2 text-sm">
                                  ₹{order.total.toLocaleString()}
                                </td>
                                <td className="py-3 px-2 text-right">
                                  <Button variant="ghost" size="sm">
                                    View
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium mb-1">No orders yet</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't placed any orders yet.
                        </p>
                        <Button onClick={() => window.location.href = '/'}>
                          Start Shopping
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                    <CardDescription>
                      Items you've saved for later
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center p-6">
                        <Loader2 className="h-8 w-8 animate-spin text-usha-burgundy" />
                      </div>
                    ) : wishlist.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wishlist.map((item) => (
                          <div key={item.id} className="border rounded-lg overflow-hidden">
                            <div className="bg-white h-40 flex items-center justify-center p-2">
                              <img 
                                src={item.products.image || "/placeholder.svg"} 
                                alt={item.products.name}
                                className="max-h-full object-contain"
                              />
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium line-clamp-1">{item.products.name}</h3>
                              <div className="flex items-center mt-1">
                                <span className="font-medium text-usha-burgundy">
                                  ₹{(item.products.price - (item.products.price * item.products.discount / 100)).toLocaleString()}
                                </span>
                                {item.products.discount > 0 && (
                                  <span className="ml-2 text-sm text-muted-foreground line-through">
                                    ₹{item.products.price.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <div className="mt-3 flex space-x-2">
                                <Button size="sm" className="w-full bg-usha-burgundy hover:bg-usha-burgundy/90">
                                  Add to Cart
                                </Button>
                                <Button size="sm" variant="outline">
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium mb-1">Your wishlist is empty</h3>
                        <p className="text-muted-foreground mb-4">
                          Save items you like to your wishlist to buy them later.
                        </p>
                        <Button onClick={() => window.location.href = '/'}>
                          Start Shopping
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
