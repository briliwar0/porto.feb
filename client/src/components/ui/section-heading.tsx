import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

interface SectionHeadingProps {
  title: string;
  highlightedText: string;
  description?: string;
}

const SectionHeading = ({ title, highlightedText, description }: SectionHeadingProps) => {
  return (
    <motion.div 
      className="text-center mb-16"
      variants={fadeIn('up')}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <h2 className="text-3xl md:text-5xl font-bold font-sans mb-4">
        {title} <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{highlightedText}</span>
      </h2>
      <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
      
      {description && (
        <p className="text-lg mt-6 max-w-2xl mx-auto text-muted-foreground">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
