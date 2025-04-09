import { motion } from 'framer-motion';
import { useTypewriter } from '@/hooks/useTypewriter';
import { PERSONAL_INFO, TYPING_PHRASES, SOCIAL_LINKS } from '@/lib/constants';
import { fadeIn, floatingAnimation } from '@/lib/animations';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import febriProfilePic from '../assets/febri-profile.png';

const HeroSection = () => {
  const typewriterText = useTypewriter({
    words: TYPING_PHRASES,
    loop: true
  });

  return (
    <section id="home" className="pt-40 pb-20 md:pb-32 md:pt-48 px-6 min-h-screen flex items-center relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
            variants={fadeIn('right')}
            initial="hidden"
            animate="show"
          >
            <p className="text-lg md:text-xl text-secondary mb-4 font-medium">Hello, I'm</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-sans mb-6">
              <span>{PERSONAL_INFO.name.split(' ')[0]}</span>{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {PERSONAL_INFO.name.split(' ')[1]}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground h-8">
              <span>{typewriterText}</span>
              <motion.span 
                className="inline-block w-0.5 h-6 bg-primary ml-1 align-middle"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              />
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  className="px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition"
                  onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Projects
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline"
                  className="px-8 py-6 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition"
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Contact Me
                </Button>
              </motion.div>
            </div>
            <div className="flex mt-10 gap-6 justify-center lg:justify-start">
              {SOCIAL_LINKS.map((social, index) => (
                <motion.a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-primary transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.8 }}
                  aria-label={social.platform}
                >
                  <i className={`fab fa-${social.icon}`}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 flex justify-center relative"
            variants={fadeIn('left', 0.2)}
            initial="hidden"
            animate="show"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
              <div className="absolute inset-1 rounded-full overflow-hidden bg-background">
                <img 
                  src={febriProfilePic} 
                  alt="Febri Developer" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute -top-10 -right-8 w-20 h-20 bg-secondary opacity-20 rounded-full"
              variants={floatingAnimation}
              animate="animate"
            />
            <motion.div 
              className="absolute bottom-10 -left-10 w-16 h-16 bg-primary opacity-20 rounded-full"
              variants={floatingAnimation}
              animate="animate"
              transition={{ delay: 2 }}
            />
            <motion.div 
              className="absolute top-1/2 right-0 w-12 h-12 bg-yellow-400 opacity-20 rounded-full"
              variants={floatingAnimation}
              animate="animate"
              transition={{ delay: 4 }}
            />
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <a 
            href="#about" 
            aria-label="Scroll to About section"
            className="inline-block hover:text-primary transition-colors"
          >
            <ChevronDownIcon className="w-8 h-8" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
