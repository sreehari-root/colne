
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewsletterSection() {
  return (
    <section className="py-16 bg-usha-burgundy/10">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-muted-foreground mb-8">
            Stay updated with our latest collections, exclusive offers, and styling tips for traditional Indian wear.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="h-12"
            />
            <Button className="h-12 bg-usha-burgundy hover:bg-usha-burgundy/90 text-white whitespace-nowrap">
              Subscribe
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from Usha Designs.
          </p>
        </div>
      </div>
    </section>
  );
}
