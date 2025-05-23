
import React, { useState } from 'react';
import { Settings, User, Store, Mail, Bell, Lock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from '@/components/layout/AdminLayout';

const SettingsPage = () => {
  const { toast } = useToast();
  
  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Usha Designs',
    storeEmail: 'info@ushadesigns.com',
    storePhone: '+91 98765 43210',
    storeAddress: '123 Fashion Street, Mumbai, Maharashtra, 400001',
    currency: 'INR',
    taxRate: '18',
    supportEmail: 'support@ushadesigns.com',
  });
  
  // Email notification settings
  const [emailSettings, setEmailSettings] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    abandonedCart: true,
    productRestock: false,
    newsletter: true,
  });
  
  // Admin user settings
  const [userSettings, setUserSettings] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStoreSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEmailSettingChange = (setting: string, checked: boolean) => {
    setEmailSettings(prev => ({ ...prev, [setting]: checked }));
  };
  
  const handleUserSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const saveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would send the settings to the server
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your store settings have been updated successfully.",
      });
      setIsLoading(false);
    }, 1000);
  };
  
  const saveEmailSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would send the settings to the server
    setTimeout(() => {
      toast({
        title: "Notification settings saved",
        description: "Your email notification settings have been updated successfully.",
      });
      setIsLoading(false);
    }, 1000);
  };
  
  const saveUserSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate passwords
    if (userSettings.newPassword && userSettings.newPassword !== userSettings.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "The new password and confirm password fields must match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // In a real app, this would send the settings to the server
    setTimeout(() => {
      toast({
        title: "User settings saved",
        description: "Your user settings have been updated successfully.",
      });
      setIsLoading(false);
      // Clear password fields after successful update
      setUserSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your store preferences and account settings</p>
        </div>
        
        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="store">
              <Store className="mr-2 h-4 w-4" />
              Store Settings
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="account">
              <User className="mr-2 h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="store">
            <Card>
              <form onSubmit={saveStoreSettings}>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                  <CardDescription>
                    Manage your store details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        name="storeName"
                        value={storeSettings.storeName}
                        onChange={handleStoreSettingChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeEmail">Store Email</Label>
                      <Input
                        id="storeEmail"
                        name="storeEmail"
                        type="email"
                        value={storeSettings.storeEmail}
                        onChange={handleStoreSettingChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storePhone">Store Phone</Label>
                      <Input
                        id="storePhone"
                        name="storePhone"
                        value={storeSettings.storePhone}
                        onChange={handleStoreSettingChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        id="currency"
                        name="currency"
                        value={storeSettings.currency}
                        onChange={handleStoreSettingChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="storeAddress">Store Address</Label>
                    <Textarea
                      id="storeAddress"
                      name="storeAddress"
                      value={storeSettings.storeAddress}
                      onChange={handleStoreSettingChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        name="taxRate"
                        type="number"
                        value={storeSettings.taxRate}
                        onChange={handleStoreSettingChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input
                        id="supportEmail"
                        name="supportEmail"
                        type="email"
                        value={storeSettings.supportEmail}
                        onChange={handleStoreSettingChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <form onSubmit={saveEmailSettings}>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Configure when to send email notifications to customers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Order Confirmation</h3>
                        <p className="text-sm text-muted-foreground">
                          Send email when an order is placed
                        </p>
                      </div>
                      <Switch
                        checked={emailSettings.orderConfirmation}
                        onCheckedChange={(checked) => handleEmailSettingChange('orderConfirmation', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Order Shipped</h3>
                        <p className="text-sm text-muted-foreground">
                          Send email when an order is shipped
                        </p>
                      </div>
                      <Switch
                        checked={emailSettings.orderShipped}
                        onCheckedChange={(checked) => handleEmailSettingChange('orderShipped', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Order Delivered</h3>
                        <p className="text-sm text-muted-foreground">
                          Send email when an order is delivered
                        </p>
                      </div>
                      <Switch
                        checked={emailSettings.orderDelivered}
                        onCheckedChange={(checked) => handleEmailSettingChange('orderDelivered', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Abandoned Cart</h3>
                        <p className="text-sm text-muted-foreground">
                          Send reminder email for abandoned carts
                        </p>
                      </div>
                      <Switch
                        checked={emailSettings.abandonedCart}
                        onCheckedChange={(checked) => handleEmailSettingChange('abandonedCart', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Product Restock</h3>
                        <p className="text-sm text-muted-foreground">
                          Notify customers when out-of-stock items are restocked
                        </p>
                      </div>
                      <Switch
                        checked={emailSettings.productRestock}
                        onCheckedChange={(checked) => handleEmailSettingChange('productRestock', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Newsletter</h3>
                        <p className="text-sm text-muted-foreground">
                          Send promotional newsletters to subscribed customers
                        </p>
                      </div>
                      <Switch
                        checked={emailSettings.newsletter}
                        onCheckedChange={(checked) => handleEmailSettingChange('newsletter', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <form onSubmit={saveUserSettings}>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Update your account information and change your password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={userSettings.name}
                        onChange={handleUserSettingChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userSettings.email}
                        onChange={handleUserSettingChange}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={userSettings.currentPassword}
                          onChange={handleUserSettingChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={userSettings.newPassword}
                            onChange={handleUserSettingChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={userSettings.confirmPassword}
                            onChange={handleUserSettingChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
