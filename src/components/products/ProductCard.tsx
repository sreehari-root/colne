
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, calculateDiscountPrice, getStarRating } from '@/lib/utils';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
  inStock?: boolean;
  rating?: number;
  salesCount?: number;
}

export default function ProductCard({
  id,
  name,
  price,
  discount = 0,
  image,
  category,
  inStock = true,
  rating,
  salesCount
}: ProductCardProps) {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Calculate discounted price
  const finalPrice = discount ? calculateDiscountPrice(price, discount) : price;
  
  // Check initial wishlist status
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user) return;
      setIsLoadingWishlist(true);
      try {
        const { data, error } = await supabase
          .from('wishlist')
          .select('product_id')
          .eq('user_id', user.id)
          .eq('product_id', id)
          .maybeSingle();

        if (error) {
          throw error;
        }
        setIsWishlisted(!!data);
      } catch (error: any) {
        // Do not show toast for initial check failure, just log it
        console.error('Error checking wishlist status:', error.message);
      } finally {
        setIsLoadingWishlist(false);
      }
    };

    checkWishlistStatus();
  }, [id, user]);

  const handleToggleWishlist = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add items to your wishlist.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingWishlist(true);
    try {
      if (isWishlisted) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .match({ user_id: user.id, product_id: id });

        if (error) throw error;
        setIsWishlisted(false);
        toast({
          title: 'Removed from Wishlist',
          description: `${name} has been removed from your wishlist.`,
        });
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlist')
          .insert([{ user_id: user.id, product_id: id }]);

        if (error) throw error;
        setIsWishlisted(true);
        toast({
          title: 'Added to Wishlist',
          description: `${name} has been added to your wishlist.`,
          variant: 'success',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error Updating Wishlist',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingWishlist(false);
    }
  };
  
  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to add items to your cart.',
        variant: 'destructive',
      });
      return;
    }

    if (!inStock) {
      toast({
        title: 'Out of Stock',
        description: 'This product is currently out of stock.',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      // Check if item already in cart
      const { data: existingCartItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('product_id')
        .eq('user_id', user.id)
        .eq('product_id', id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (existingCartItem) {
        toast({
          title: 'Already in Cart',
          description: `${name} is already in your cart.`,
        });
      } else {
        // Add to cart
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert([{ user_id: user.id, product_id: id, quantity: 1 }]);

        if (insertError) {
          throw insertError;
        }
        toast({
          title: 'Added to Cart',
          description: `${name} has been added to your cart.`,
          variant: 'success',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error Adding to Cart',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  const renderStarRating = () => {
    if (!rating) return null;
    
    return getStarRating(rating).map(star => (
      <span 
        key={star.key} 
        className={star.type === 'empty' ? 'text-gray-300' : 'text-yellow-500'}
      >
        ★
      </span>
    ));
  };
  
  return (
    <div className="product-card group rounded-lg border bg-card text-card-foreground overflow-hidden">
      <div className="relative product-image-container">
        <Link to={`/product/${id}`}>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-64 object-cover product-image"
          />
        </Link>
        
        {discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-usha-burgundy text-white">
            {discount}% OFF
          </Badge>
        )}
        
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <p className="text-white font-medium text-lg">Out of Stock</p>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-2 left-2 bg-white/80 hover:bg-white h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Add to wishlist"
        >
          <Heart size={16} fill={isWishlisted ? 'red' : 'none'} className={isWishlisted ? 'text-red-500' : 'text-gray-700'} />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/product/${id}`} className="block">
              <h3 className="font-medium text-lg leading-tight hover:text-usha-burgundy transition-colors line-clamp-1">
                {name}
              </h3>
            </Link>
            
            <p className="text-muted-foreground text-sm mt-1">
              {category}
            </p>
            
            {rating && (
              <div className="flex items-center mt-1">
                {renderStarRating()}
                <span className="ml-1 text-xs text-muted-foreground">
                  ({rating.toFixed(1)})
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">
                {formatCurrency(finalPrice)}
              </span>
              
              {discount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(price)}
                </span>
              )}
            </div>
            
            {salesCount !== undefined && (
              <div className="text-xs text-muted-foreground">
                {salesCount} sold
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <Button 
            className="w-full bg-usha-burgundy hover:bg-usha-burgundy/90 text-white"
            disabled={!inStock || isAddingToCart}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
