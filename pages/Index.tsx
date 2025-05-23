
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import HeroCarousel from '@/components/home/HeroCarousel';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BestSelling from '@/components/home/BestSelling';
import Testimonials from '@/components/home/Testimonials';
import NewsletterSection from '@/components/home/NewsletterSection';
import { Button } from '@/components/ui/button';

export default function Index() {
  return (
    <MainLayout>
      <div className="min-h-screen">
        <HeroCarousel />
        
        <FeaturedCategories />
        
        <div className="container py-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full indian-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-6 text-lg text-muted-foreground">
                Exquisite Collections
              </span>
            </div>
          </div>
        </div>
        
        <FeaturedProducts />
        
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-72 overflow-hidden rounded-lg group">
              <img 
                src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop" 
                alt="New Arrivals" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6">
                <h3 className="text-white text-2xl font-bold mb-3">New Arrivals</h3>
                <p className="text-white/80 mb-4">Discover our latest collection of designer sarees</p>
                <Button 
                  asChild 
                  className="bg-white text-usha-burgundy hover:bg-white/90"
                >
                  <a href="/new-arrivals">Shop Now</a>
                </Button>
              </div>
            </div>
            
            <div className="relative h-72 overflow-hidden rounded-lg group">
              <img 
                src="https://images.unsplash.com/photo-1603189817218-32a1ec250280?q=80&w=1200&auto=format&fit=crop" 
                alt="Bridal Collection" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6">
                <h3 className="text-white text-2xl font-bold mb-3">Wedding Collection</h3>
                <p className="text-white/80 mb-4">Exquisite bridal sarees for your special day</p>
                <Button 
                  asChild 
                  className="bg-white text-usha-burgundy hover:bg-white/90"
                >
                  <a href="/category/bridal">Explore</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <BestSelling />
        
        <Testimonials />
        
        <NewsletterSection />
      </div>
    </MainLayout>
  );
}
