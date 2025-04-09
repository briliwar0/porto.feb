import { motion } from 'framer-motion';
import { SOCIAL_LINKS, PERSONAL_INFO } from '@/lib/constants';

const Footer = () => {
  // Create two equal columns of social links
  const socialLinksHalf = Math.ceil(SOCIAL_LINKS.length / 2);
  const firstRowSocialLinks = SOCIAL_LINKS.slice(0, socialLinksHalf);
  const secondRowSocialLinks = SOCIAL_LINKS.slice(socialLinksHalf);

  return (
    <footer className="py-12 bg-background/80 backdrop-blur-lg border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <motion.div 
            className="flex flex-col"
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
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                <span className="block mb-1">
                  <i className="fas fa-map-marker-alt mr-2"></i> {PERSONAL_INFO.location}
                </span>
                <span className="block mb-1">
                  <i className="fas fa-envelope mr-2"></i> {PERSONAL_INFO.email}
                </span>
                <span className="block">
                  <i className="fas fa-phone mr-2"></i> {PERSONAL_INFO.phone}
                </span>
              </p>
            </div>
          </motion.div>
          
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Connect With Me</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {SOCIAL_LINKS.slice(0, 8).map((social, index) => (
                <motion.a 
                  key={social.platform} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 dark:bg-dark/20 hover:bg-primary hover:text-white transition-all"
                  aria-label={social.platform}
                  title={social.platform}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <i className={`fab fa-${social.icon}`}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-muted-foreground hover:text-primary transition-all">Home</a>
              </li>
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-all">About</a>
              </li>
              <li>
                <a href="#skills" className="text-muted-foreground hover:text-primary transition-all">Skills</a>
              </li>
              <li>
                <a href="#projects" className="text-muted-foreground hover:text-primary transition-all">Projects</a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-all">Contact</a>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
            © {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Designed & Built with <span className="text-red-500">❤</span> by <a href="#home" className="text-primary hover:underline">Febri Developer</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
