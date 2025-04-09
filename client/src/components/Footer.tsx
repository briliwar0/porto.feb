import { motion } from 'framer-motion';
import { SOCIAL_LINKS } from '@/lib/constants';

const Footer = () => {
  return (
    <footer className="py-8 bg-background/80 backdrop-blur-lg border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            className="mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <a href="#home" className="text-2xl font-bold font-sans">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Febri.dev
              </span>
            </a>
            <p className="mt-2 text-muted-foreground">Crafting digital experiences that matter.</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center md:items-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-muted-foreground mb-2">© {new Date().getFullYear()} Febri Developer. All rights reserved.</p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a 
                  key={social.platform} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.platform}
                >
                  <i className={`fab fa-${social.icon}`}></i>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
