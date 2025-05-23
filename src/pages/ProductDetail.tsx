import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatCurrency, getStarRating, calculateDiscountPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Heart, ShoppingCart, Truck, Package, RotateCcw, Star, Share2, Loader2, ArrowLeft } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  category?: string; // Make this optional
  category_id?: string; // Add category_id as an optional field
  image: string | null;
  stock: number;
  rating: number;
  bestseller: boolean;
  featured: boolean;
  created_at?: string; // Add this as optional
  updated_at?: string; // Add this as optional
  sales_count?: number; // Add this as optional
};

type ReviewProfile = {
  first_name: string | null;
  last_name: string | null;
};

type Review = {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: ReviewProfile | null;
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [userReview, setUserReview] = useState<{ rating: number; comment: string }>({
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [categoryName, setCategoryName] = useState<string>('');

  const fetchProduct = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Fetch product data
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError) {
        console.error('Error fetching product:', productError);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // Fetch category name if category_id exists
      if (productData && productData.category_id) {
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('name')
          .eq('id', productData.category_id)
          .single();
          
        if (!categoryError && categoryData) {
          setCategoryName(categoryData.name);
          
          // Create a complete product object with both database fields and derived fields
          const completeProduct: Product = {
            ...productData,
            category: categoryData.name
          };
          
          setProduct(completeProduct);
        } else {
          // If category fetch fails, still set the product but without category
          setProduct(productData as Product);
        }
      } else {
        // If no category_id, just set the product
        setProduct(productData as Product);
      }
    } catch (error) {
      console.error('Error in fetch operation:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!id) return;

    setReviewLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id, user_id, product_id, rating, comment, created_at,
          profiles:user_id(first_name, last_name)
        `)
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
      } else {
        // Safely create reviews with consistent profile structure
        const processedReviews: Review[] = (data || []).map(review => ({
          id: review.id,
          user_id: review.user_id,
          product_id: review.product_id,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at,
          profiles: review.profiles && typeof review.profiles === 'object' 
            ? { 
                first_name: (review.profiles as any)?.first_name || null, 
                last_name: (review.profiles as any)?.last_name || null 
              } 
            : { first_name: null, last_name: null }
        }));
        
        setReviews(processedReviews);
      }
    } catch (error) {
      console.error('Error processing reviews:', error);
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= (product?.stock || 100)) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < (product?.stock || 100)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a review",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!product) return;

    setSubmitting(true);
    
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id: product.id,
        user_id: user.id,
        rating: userReview.rating,
        comment: userReview.comment
      });

    if (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit your review",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!"
      });
      
      // Reset form and refresh reviews
      setUserReview({ rating: 5, comment: '' });
      fetchReviews();
    }
    
    setSubmitting(false);
  };

  const addToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!product) return;
    
    setAddingToCart(true);

    try {
      // First, get or create a cart for the user
      let cartId;
      
      // Check if the user already has a cart
      const { data: existingCarts, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (cartError && cartError.code !== 'PGRST116') {
        throw new Error('Error fetching cart');
      }
      
      if (existingCarts) {
        cartId = existingCarts.id;
      } else {
        // Create a new cart
        const { data: newCart, error: createCartError } = await supabase
          .from('carts')
          .insert({ user_id: user.id })
          .select('id')
          .single();
        
        if (createCartError) {
          throw new Error('Error creating cart');
        }
        
        cartId = newCart.id;
      }
      
      // Now check if the product is already in the cart
      const { data: existingItems, error: itemError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cartId)
        .eq('product_id', product.id)
        .single();
      
      if (itemError && itemError.code !== 'PGRST116') {
        throw new Error('Error checking cart items');
      }
      
      if (existingItems) {
        // Update existing cart item quantity
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItems.quantity + quantity })
          .eq('id', existingItems.id);
        
        if (updateError) {
          throw new Error('Error updating cart item');
        }
      } else {
        // Add new item to cart
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cartId,
            product_id: product.id,
            quantity: quantity
          });
        
        if (insertError) {
          throw new Error('Error adding item to cart');
        }
      }
      
      toast({
        title: "Added to cart",
        description: `${product.name} (${quantity}) added to your cart`
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const addToWishlist = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!product) return;
    
    setAddingToWishlist(true);

    try {
      // Check if the item is already in the wishlist
      const { data: existingItem, error: checkError } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error('Error checking wishlist');
      }
      
      if (existingItem) {
        // Item already in wishlist, remove it
        const { error: deleteError } = await supabase
          .from('wishlists')
          .delete()
          .eq('id', existingItem.id);
        
        if (deleteError) {
          throw new Error('Error removing from wishlist');
        }
        
        toast({
          title: "Removed from wishlist",
          description: `${product.name} removed from your wishlist`
        });
      } else {
        // Add to wishlist
        const { error: insertError } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            product_id: product.id
          });
        
        if (insertError) {
          throw new Error('Error adding to wishlist');
        }
        
        toast({
          title: "Added to wishlist",
          description: `${product.name} added to your wishlist`
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive"
      });
    } finally {
      setAddingToWishlist(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-12 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-usha-burgundy" />
            <p className="mt-4 text-lg">Loading product details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-medium mb-4">Product not found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </MainLayout>
    );
  }

  const discountedPrice = calculateDiscountPrice(product.price, product.discount);
  const stars = getStarRating(product.rating);
  
  return (
    <MainLayout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-usha-burgundy">Home</a>
          <span className="mx-2">/</span>
          <a href={`/category/${categoryName.toLowerCase().replace(/ /g, '-')}`} className="hover:text-usha-burgundy">
            {categoryName || 'Category'}
          </a>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Product image */}
          <div className="bg-white p-4 rounded-lg border flex items-center justify-center">
            <img 
              src={product.image || "/placeholder.svg"} 
              alt={product.name}
              className="max-h-[500px] object-contain"
            />
          </div>

          {/* Product details */}
          <div>
            <h1 className="text-3xl font-serif font-medium text-gray-800">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mt-2 mb-4">
              <div className="flex items-center mr-2">
                {stars.map((star) => (
                  <Star
                    key={star.key}
                    className={`h-4 w-4 ${
                      star.type === 'full' ? 'text-yellow-400 fill-current' :
                      star.type === 'half' ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              {product.discount > 0 ? (
                <div className="flex items-center">
                  <span className="text-2xl font-medium text-usha-burgundy mr-2">
                    {formatCurrency(discountedPrice)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-sm rounded">
                    {product.discount}% Off
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-medium text-usha-burgundy">
                  {formatCurrency(product.price)}
                </span>
              )}
              <p className="text-sm text-muted-foreground mt-1">Inclusive of all taxes</p>
            </div>
              
            {/* Description */}
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Quantity selector */}
            <div className="mb-6">
              <p className="font-medium mb-2">Quantity</p>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 mx-2 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
                <span className="ml-3 text-sm text-muted-foreground">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                className="flex-1 bg-usha-burgundy hover:bg-usha-burgundy/90"
                onClick={addToCart}
                disabled={addingToCart}
              >
                {addingToCart ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="mr-2 h-4 w-4" />
                )}
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={addToWishlist}
                disabled={addingToWishlist}
              >
                {addingToWishlist ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Heart className="mr-2 h-4 w-4" />
                )}
                Add to Wishlist
              </Button>
            </div>

            {/* Shipping info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-start">
                <Truck className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Free Delivery</h3>
                  <p className="text-sm text-muted-foreground">On orders above ₹1,000</p>
                </div>
              </div>
              <div className="flex items-start">
                <Package className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Secure Packaging</h3>
                  <p className="text-sm text-muted-foreground">Premium quality packaging to protect your sarees</p>
                </div>
              </div>
              <div className="flex items-start">
                <RotateCcw className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Easy Returns</h3>
                  <p className="text-sm text-muted-foreground">10 day easy return policy</p>
                </div>
              </div>
            </div>
            
            {/* Share */}
            <div className="flex items-center">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs: Description, Reviews, etc. */}
        <div className="mt-12">
          <Tabs defaultValue="reviews">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-8">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description">
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-2xl font-serif mb-4">Product Description</h2>
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Product Features:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Premium quality fabric</li>
                      <li>Authentic design</li>
                      <li>Handcrafted with attention to detail</li>
                      <li>Elegant and comfortable to wear</li>
                      <li>Perfect for any special occasions</li>
                    </ul>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Care Instructions:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Dry clean only</li>
                      <li>Store in a cool, dry place</li>
                      <li>Handle with care to maintain its quality and appearance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="bg-white p-6 rounded-lg border">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif">Customer Reviews</h2>
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {stars.map((star) => (
                        <Star
                          key={star.key}
                          className={`h-4 w-4 ${
                            star.type === 'full' ? 'text-yellow-400 fill-current' :
                            star.type === 'half' ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">
                      {product.rating.toFixed(1)} ({reviews.length} reviews)
                    </span>
                  </div>
                </div>

                {/* Review form */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Write a Review</h3>
                  {user ? (
                    <form onSubmit={handleReviewSubmit}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="rating">Rating</Label>
                          <div className="flex items-center mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setUserReview({ ...userReview, rating: star })}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`h-6 w-6 ${
                                    star <= userReview.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="ml-2 text-sm">{userReview.rating} of 5</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="comment">Your Review</Label>
                          <Textarea
                            id="comment"
                            placeholder="Share your thoughts about this product"
                            className="mt-2"
                            rows={4}
                            value={userReview.comment}
                            onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                            required
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="bg-usha-burgundy hover:bg-usha-burgundy/90"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Submit Review'
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-muted p-4 rounded text-center">
                      <p className="mb-2">Please sign in to write a review</p>
                      <Button 
                        onClick={() => navigate('/auth')} 
                        variant="outline"
                      >
                        Sign In
                      </Button>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Reviews list */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Customer Reviews ({reviews.length})</h3>
                  {reviewLoading ? (
                    <div className="text-center p-6">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-usha-burgundy" />
                      <p className="mt-2">Loading reviews...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
                          <div className="flex justify-between mb-2">
                            <div>
                              <p className="font-medium">
                                {review.profiles?.first_name || 'Anonymous'} {review.profiles?.last_name || ''}
                              </p>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="mt-3">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
