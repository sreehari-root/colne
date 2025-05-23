
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function calculateDiscountPrice(price: number, discount: number): number {
  return price - (price * discount / 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Changed to return an array of objects instead of JSX
export function getStarRating(rating: number): { type: string; key: string }[] {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push({ type: 'full', key: `star-${i}` });
  }
  
  if (hasHalfStar) {
    stars.push({ type: 'half', key: 'half-star' });
  }
  
  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push({ type: 'empty', key: `empty-${i}` });
  }
  
  return stars;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function getCategoryUrl(category: string): string {
  return `/category/${generateSlug(category)}`;
}
