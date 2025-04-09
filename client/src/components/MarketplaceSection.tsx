import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/lib/animations';
import { MARKETPLACE_ITEMS } from '@/lib/constants';
import { MarketplaceFilter, MarketplaceItem } from '@/lib/types';
import SectionHeading from './ui/section-heading';
import MarketplaceCard from './ui/marketplace-card';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, ShoppingBag, Code, BookOpen, PlayCircle, Layers } from 'lucide-react';

const MarketplaceSection = () => {
  const [activeFilter, setActiveFilter] = useState<MarketplaceFilter>('all');
  const [visibleItems, setVisibleItems] = useState(6);
  const [filteredItems, setFilteredItems] = useState(MARKETPLACE_ITEMS.slice(0, visibleItems));
  
  useEffect(() => {
    // Apply filter and limit to visible count
    const filtered = activeFilter === 'all' 
      ? MARKETPLACE_ITEMS 
      : MARKETPLACE_ITEMS.filter(item => item.category === activeFilter);
    
    setFilteredItems(filtered.slice(0, visibleItems));
  }, [activeFilter, visibleItems]);

  const handleFilterClick = (filter: MarketplaceFilter) => {
    // Reset visible count when changing filter
    setVisibleItems(6);
    setActiveFilter(filter);
  };
  
  const loadMoreItems = () => {
    setVisibleItems(prev => prev + 3);
  };
  
  const totalFilteredCount = activeFilter === 'all' 
    ? MARKETPLACE_ITEMS.length 
    : MARKETPLACE_ITEMS.filter(item => item.category === activeFilter).length;
  
  const hasMoreItems = filteredItems.length < totalFilteredCount;

  // Filter icons
  const filterIcons = {
    all: <ShoppingBag className="h-4 w-4 mr-2" />,
    service: <Code className="h-4 w-4 mr-2" />,
    template: <Layers className="h-4 w-4 mr-2" />,
    plugin: <Code className="h-4 w-4 mr-2" />,
    ebook: <BookOpen className="h-4 w-4 mr-2" />,
    course: <PlayCircle className="h-4 w-4 mr-2" />
  };

  return (
    <section id="marketplace" className="py-20 md:py-32 px-6 min-h-screen flex items-center relative">
      <div className="container mx-auto">
        <SectionHeading 
          title="Digital"
          highlightedText="Marketplace"
          description="Explore my collection of digital products and services designed to help you achieve your goals. From templates to custom development services, find what you need."
        />
        
        {/* Marketplace filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={fadeIn('up')}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[
            { id: 'all', label: 'All Items' },
            { id: 'service', label: 'Services' },
            { id: 'template', label: 'Templates' },
            { id: 'plugin', label: 'Plugins' },
            { id: 'ebook', label: 'E-Books' },
            { id: 'course', label: 'Courses' }
          ].map(filter => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id as MarketplaceFilter ? 'default' : 'outline'}
              onClick={() => handleFilterClick(filter.id as MarketplaceFilter)}
              className={`px-6 py-2 rounded-full font-medium transition-all flex items-center ${
                activeFilter === filter.id as MarketplaceFilter
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white/5 dark:bg-dark/20 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {filterIcons[filter.id as keyof typeof filterIcons]}
              {filter.label}
            </Button>
          ))}
        </motion.div>
        
        {/* Marketplace grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={fadeIn('up', 0.1 * Math.min(index, 5))}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <MarketplaceCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredItems.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-muted-foreground text-lg">No items found in this category.</p>
          </motion.div>
        )}
        
        <motion.div 
          className="text-center mt-12"
          variants={fadeIn('up', 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {hasMoreItems ? (
            <Button
              variant="outline"
              className="px-8 py-3 text-primary font-medium rounded-lg border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-md"
              onClick={loadMoreItems}
            >
              Load More <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="outline"
              className="px-8 py-3 text-primary font-medium rounded-lg border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-md"
              onClick={() => setActiveFilter('all')}
              disabled={activeFilter === 'all' && filteredItems.length === MARKETPLACE_ITEMS.length}
            >
              {activeFilter === 'all' && filteredItems.length === MARKETPLACE_ITEMS.length 
                ? 'All Items Loaded' 
                : 'View All Items'} 
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default MarketplaceSection;