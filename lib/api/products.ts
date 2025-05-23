
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

export interface ProductType {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount: number | null;
  category_id: string | null;
  image: string | null;
  stock: number | null;
  featured: boolean | null;
  bestseller: boolean | null;
  rating: number | null;
  sales_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProductWithCategory extends ProductType {
  category_name?: string;
}

export const fetchProducts = async (): Promise<ProductWithCategory[]> => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Get all category IDs from products
    const categoryIds = products
      .map(product => product.category_id)
      .filter(Boolean) as string[];

    // Fetch all categories for these IDs in one go
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name')
      .in('id', categoryIds);

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
    }

    // Create a map of category ID to category name for quick lookup
    const categoryMap = new Map();
    if (categories) {
      categories.forEach(category => {
        categoryMap.set(category.id, category.name);
      });
    }

    // Add category name to each product
    const productsWithCategories = products.map(product => ({
      ...product,
      category_name: product.category_id ? categoryMap.get(product.category_id) : undefined
    }));

    return productsWithCategories;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const addProduct = async (productData: Partial<ProductType>, imageFile?: File): Promise<ProductType | null> => {
  try {
    let imagePath = null;

    // Upload image if provided
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the uploaded image
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      imagePath = data.publicUrl;
    }

    // Create product with image path
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        image: imagePath,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast({
      title: "Product Added",
      description: `${productData.name} has been added successfully.`,
    });

    return data;
  } catch (error) {
    console.error('Error adding product:', error);
    toast({
      title: "Error",
      description: "Failed to add product. Please try again.",
      variant: "destructive"
    });
    return null;
  }
};

export const updateProduct = async (
  id: string, 
  productData: Partial<ProductType>, 
  imageFile?: File
): Promise<ProductType | null> => {
  try {
    let imagePath = productData.image;

    // Upload new image if provided
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the uploaded image
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      imagePath = data.publicUrl;
    }

    // Update product
    const { data, error } = await supabase
      .from('products')
      .update({
        ...productData,
        image: imagePath,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast({
      title: "Product Updated",
      description: `${productData.name} has been updated successfully.`,
    });

    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    toast({
      title: "Error",
      description: "Failed to update product. Please try again.",
      variant: "destructive"
    });
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    // Get product details to know which image to delete
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('image')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Delete the product
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    // If product had an image, try to delete it from storage
    if (product && product.image) {
      try {
        const imagePath = product.image.split('/').pop();
        if (imagePath) {
          await supabase.storage.from('product-images').remove([imagePath]);
        }
      } catch (imageError) {
        console.error('Error deleting product image:', imageError);
        // Continue even if image deletion fails
      }
    }

    toast({
      title: "Product Deleted",
      description: "The product has been successfully removed.",
    });

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    toast({
      title: "Error",
      description: "Failed to delete product. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};
