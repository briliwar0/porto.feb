import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/lib/animations';
import { FRONTEND_SKILLS, BACKEND_SKILLS, OTHER_SKILLS } from '@/lib/constants';
import SectionHeading from './ui/section-heading';
import SkillBar from './ui/skill-bar';
import { CodeIcon, ServerIcon } from 'lucide-react';

const SkillsSection = () => {
  const [animate, setAnimate] = useState(false);
  const skillsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(skillsRef, { once: false, amount: 0.3 });
  
  // Update animation state when section comes into view
  useEffect(() => {
    if (isInView) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [isInView]);

  return (
    <section id="skills" className="py-20 md:py-32 px-6 min-h-screen flex items-center relative">
      <div className="container mx-auto">
        <SectionHeading 
          title="My"
          highlightedText="Skills"
          description="I've worked with a variety of technologies across the full stack, focusing on building
          scalable, performant, and user-friendly applications."
        />
        
        <div 
          ref={skillsRef} 
          className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto"
        >
          {/* Frontend Skills */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm dark:bg-dark/20 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 hover:-translate-y-1"
            variants={fadeIn('right')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-4">
                <CodeIcon className="text-white" />
              </div>
              <h3 className="text-2xl font-bold font-sans">Frontend</h3>
            </div>
            
            <div className="space-y-6">
              {FRONTEND_SKILLS.map((skill, index) => (
                <SkillBar key={index} skill={skill} animate={animate} />
              ))}
            </div>
          </motion.div>
          
          {/* Backend Skills */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm dark:bg-dark/20 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 hover:-translate-y-1"
            variants={fadeIn('left')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-4">
                <ServerIcon className="text-white" />
              </div>
              <h3 className="text-2xl font-bold font-sans">Backend</h3>
            </div>
            
            <div className="space-y-6">
              {BACKEND_SKILLS.map((skill, index) => (
                <SkillBar key={index} skill={skill} animate={animate} />
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Other skills in circular display */}
        <motion.div 
          className="mt-16 text-center"
          variants={fadeIn('up')}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h3 className="text-2xl font-bold font-sans mb-8">
            Other <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Technologies</span>
          </h3>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {OTHER_SKILLS.map((skill, index) => (
              <motion.div
                key={index}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/5 dark:bg-dark/20 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110"
                variants={fadeIn('up', 0.1 * index)}
              >
                <div className="text-center">
                  <i className={`fab fa-${skill.icon} text-2xl md:text-3xl text-primary mb-2`}></i>
                  <p className="text-xs md:text-sm">{skill.name}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
