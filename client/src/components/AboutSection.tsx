import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { PERSONAL_INFO, TIMELINE_ITEMS } from '@/lib/constants';
import SectionHeading from './ui/section-heading';
import TimelineItem from './ui/timeline-item';
import { DownloadIcon, UserIcon, PhoneIcon, MailIcon, MapPinIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import profileImage from '@assets/FEBRI FOR CV OR OTHER PP - Coppoiuytty50percent.png';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-32 px-6 min-h-screen flex items-center relative">
      <div className="container mx-auto">
        <SectionHeading 
          title="About"
          highlightedText="Me"
        />
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            className="lg:w-2/5"
            variants={fadeIn('right')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="relative">
              <img 
                src={profileImage} 
                alt="Febri's Profile Photo" 
                className="rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-[1.02] w-full object-cover aspect-square"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-lg bg-gradient-to-r from-primary to-secondary p-0.5 shadow-lg">
                <div className="w-full h-full rounded-lg bg-background flex items-center justify-center">
                  <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">5+</span>
                  <span className="text-xs ml-1">Years<br/>Exp.</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-3/5"
            variants={fadeIn('left')}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold font-sans mb-4">
              Full-Stack Developer based in {PERSONAL_INFO.location}
            </h3>
            <p className="text-lg mb-6 text-muted-foreground">
              I'm a passionate full-stack developer with a keen eye for design and user experience. 
              With over 5 years of professional experience, I specialize in creating responsive, 
              accessible, and performant web applications that solve real-world problems.
            </p>
            <p className="text-lg mb-8 text-muted-foreground">
              My journey in tech began with a Computer Science degree, but my curiosity led me to 
              explore UI/UX design, 3D modeling, and interactive digital experiences. I love working 
              at the intersection of code and creativity.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="font-medium flex items-center">
                  <UserIcon className="h-4 w-4 mr-2 text-primary" /> 
                  Name: <span className="ml-2 text-muted-foreground">{PERSONAL_INFO.name}</span>
                </p>
              </div>
              <div>
                <p className="font-medium flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2 text-primary" /> 
                  Phone: <span className="ml-2 text-muted-foreground">{PERSONAL_INFO.phone}</span>
                </p>
              </div>
              <div>
                <p className="font-medium flex items-center">
                  <MailIcon className="h-4 w-4 mr-2 text-primary" /> 
                  Email: <span className="ml-2 text-muted-foreground">{PERSONAL_INFO.email}</span>
                </p>
              </div>
              <div>
                <p className="font-medium flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2 text-primary" /> 
                  Location: <span className="ml-2 text-muted-foreground">{PERSONAL_INFO.location}</span>
                </p>
              </div>
            </div>
            
            <Button className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition">
              Download Resume <DownloadIcon className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </div>
        
        {/* Timeline */}
        <div className="mt-32">
          <h3 className="text-2xl md:text-3xl font-bold font-sans mb-12 text-center">
            My <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Journey</span>
          </h3>
          
          <div className="relative max-w-3xl mx-auto">
            {TIMELINE_ITEMS.map((item, index) => (
              <TimelineItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
