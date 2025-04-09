import { motion } from 'framer-motion';
import { Check, ArrowRight, Star } from 'lucide-react';
import { MarketplaceItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MarketplaceCardProps {
  item: MarketplaceItem;
}

const MarketplaceCard = ({ item }: MarketplaceCardProps) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'service': return 'Service';
      case 'template': return 'Template';
      case 'plugin': return 'Plugin';
      case 'ebook': return 'E-Book';
      case 'course': return 'Course';
      default: return category;
    }
  };
  
  return (
    <motion.div 
      className="h-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-white/5 dark:bg-dark/20 backdrop-blur-sm border border-border"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden h-56">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {item.isFeatured && (
          <Badge 
            className="absolute top-3 left-3 bg-primary text-white px-3 py-1"
          >
            Featured
          </Badge>
        )}
        {item.isPopular && (
          <Badge 
            className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1"
            variant="default"
          >
            <Star className="h-3.5 w-3.5 mr-1 inline-block" />
            Popular
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <Badge 
            className="mb-2"
            variant="outline"
          >
            {getCategoryLabel(item.category)}
          </Badge>
          <h3 className="text-xl font-bold text-white">{item.title}</h3>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-muted-foreground mb-5 line-clamp-2">{item.description}</p>
        
        <div className="mb-5 flex-grow">
          <h4 className="text-sm font-semibold mb-2 text-primary">What's included:</h4>
          <ul className="space-y-1">
            {item.features.slice(0, 4).map((feature: string, index: number) => (
              <li key={index} className="text-sm flex items-start">
                <Check className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
            {item.features.length > 4 && (
              <li className="text-sm text-muted-foreground">
                <span className="ml-6">+{item.features.length - 4} more</span>
              </li>
            )}
          </ul>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              {item.discountPrice ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{formatPrice(item.discountPrice)}</span>
                  <span className="text-sm text-muted-foreground line-through ml-2">{formatPrice(item.price)}</span>
                </div>
              ) : (
                <span className="text-2xl font-bold">{formatPrice(item.price)}</span>
              )}
            </div>
          </div>
          
          {item.price <= 0 ? (
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary text-white"
              onClick={() => window.location.href = item.link}
            >
              Contact Me <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary text-white"
              onClick={() => {
                const actualPrice = item.discountPrice || item.price;
                window.location.href = `/checkout?productId=${item.id}&price=${actualPrice * 100}&name=${encodeURIComponent(item.title)}`;
              }}
            >
              Buy Now <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MarketplaceCard;