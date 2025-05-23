
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ushaLogo } from '@/lib/constants';

const FooterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">{title}</h3>
    <div className="space-y-3 text-sm">{children}</div>
  </div>
);

export default function Footer() {
  return (
    <footer className="border-t mt-16 bg-background">
      <div className="container py-12">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="block">
              <img src={ushaLogo} alt="Usha Designs Logo" className="h-16" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Usha Designs - The Designer Lane, bringing you the finest collection of traditional and contemporary Indian ethnic wear since 2005.
            </p>
            <div className="flex space-x-4 pt-2">
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-usha-burgundy hover:bg-usha-burgundy/10">
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-usha-burgundy hover:bg-usha-burgundy/10">
                <Facebook size={18} />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-usha-burgundy hover:bg-usha-burgundy/10">
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>

          <FooterSection title="Shop Categories">
            <Link to="/category/pure-silk" className="block hover:text-usha-burgundy transition-colors">
              Pure Silk Sarees
            </Link>
            <Link to="/category/georgette" className="block hover:text-usha-burgundy transition-colors">
              Georgette Sarees
            </Link>
            <Link to="/category/cotton" className="block hover:text-usha-burgundy transition-colors">
              Handloom Cotton
            </Link>
            <Link to="/category/designer" className="block hover:text-usha-burgundy transition-colors">
              Designer Collections
            </Link>
            <Link to="/category/ready-sets" className="block hover:text-usha-burgundy transition-colors">
              Ready Sets & Blouses
            </Link>
          </FooterSection>

          <FooterSection title="Customer Service">
            <Link to="/about" className="block hover:text-usha-burgundy transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="block hover:text-usha-burgundy transition-colors">
              Contact Us
            </Link>
            <Link to="/shipping" className="block hover:text-usha-burgundy transition-colors">
              Shipping & Delivery
            </Link>
            <Link to="/returns" className="block hover:text-usha-burgundy transition-colors">
              Returns & Exchanges
            </Link>
            <Link to="/faq" className="block hover:text-usha-burgundy transition-colors">
              FAQ
            </Link>
          </FooterSection>

          <FooterSection title="Get In Touch">
            <div className="flex items-start space-x-3">
              <MapPin size={18} className="text-usha-burgundy shrink-0 mt-0.5" />
              <p>123 Fashion Street, Designer Hub, Textile City, India - 500001</p>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={18} className="text-usha-burgundy shrink-0" />
              <p>+91 98765 43210</p>
            </div>
            <div className="flex items-center space-x-3">
              <Mail size={18} className="text-usha-burgundy shrink-0" />
              <p>contact@ushadesigns.com</p>
            </div>
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">Subscribe to our newsletter</h4>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="h-9 bg-background"
                />
                <Button className="h-9 bg-usha-burgundy hover:bg-usha-burgundy/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </FooterSection>
        </div>
      </div>

      <div className="indian-border"></div>

      <div className="container py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Usha Designs. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link to="/privacy" className="hover:text-usha-burgundy transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-usha-burgundy transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
