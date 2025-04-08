import { motion } from 'framer-motion';
import { TimelineItem as TimelineItemType } from '@/lib/types';

interface TimelineItemProps {
  item: TimelineItemType;
  index: number;
}

const TimelineItem = ({ item, index }: TimelineItemProps) => {
  return (
    <motion.div 
      className="relative pb-12 timeline-item pl-6 border-l-2 border-border"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      viewport={{ once: true }}
    >
      <span className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background"></span>
      <h4 className="text-xl font-bold mb-2">
        {item.title} <span className="text-primary">{item.organization}</span>
      </h4>
      <p className="text-sm font-medium text-muted-foreground mb-4">{item.period}</p>
      <p className="text-muted-foreground">
        {item.description}
      </p>
    </motion.div>
  );
};

export default TimelineItem;
