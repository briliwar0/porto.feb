import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/lib/animations';
import { PROJECTS } from '@/lib/constants';
import { ProjectFilter } from '@/lib/types';
import SectionHeading from './ui/section-heading';
import ProjectCard from './ui/project-card';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('all');

  const handleFilterClick = (filter: ProjectFilter) => {
    setActiveFilter(filter);
  };

  const filteredProjects = activeFilter === 'all' 
    ? PROJECTS 
    : PROJECTS.filter(project => project.category === activeFilter);

  return (
    <section id="projects" className="py-20 md:py-32 px-6 min-h-screen flex items-center relative">
      <div className="container mx-auto">
        <SectionHeading 
          title="My"
          highlightedText="Projects"
          description="Showcasing some of my best work across different domains and technologies.
          Each project represents unique challenges and creative solutions."
        />
        
        {/* Project filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={fadeIn('up')}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => handleFilterClick('all')}
            className={`px-6 py-2 rounded-full ${
              activeFilter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-white/5 dark:bg-dark/20 hover:bg-primary hover:text-white'
            } transition-colors`}
          >
            All
          </Button>
          <Button
            variant={activeFilter === 'web' ? 'default' : 'outline'}
            onClick={() => handleFilterClick('web')}
            className={`px-6 py-2 rounded-full ${
              activeFilter === 'web' 
                ? 'bg-primary text-white' 
                : 'bg-white/5 dark:bg-dark/20 hover:bg-primary hover:text-white'
            } transition-colors`}
          >
            Web Apps
          </Button>
          <Button
            variant={activeFilter === 'mobile' ? 'default' : 'outline'}
            onClick={() => handleFilterClick('mobile')}
            className={`px-6 py-2 rounded-full ${
              activeFilter === 'mobile' 
                ? 'bg-primary text-white' 
                : 'bg-white/5 dark:bg-dark/20 hover:bg-primary hover:text-white'
            } transition-colors`}
          >
            Mobile
          </Button>
          <Button
            variant={activeFilter === 'ui' ? 'default' : 'outline'}
            onClick={() => handleFilterClick('ui')}
            className={`px-6 py-2 rounded-full ${
              activeFilter === 'ui' 
                ? 'bg-primary text-white' 
                : 'bg-white/5 dark:bg-dark/20 hover:bg-primary hover:text-white'
            } transition-colors`}
          >
            UI/UX
          </Button>
          <Button
            variant={activeFilter === '3d' ? 'default' : 'outline'}
            onClick={() => handleFilterClick('3d')}
            className={`px-6 py-2 rounded-full ${
              activeFilter === '3d' 
                ? 'bg-primary text-white' 
                : 'bg-white/5 dark:bg-dark/20 hover:bg-primary hover:text-white'
            } transition-colors`}
          >
            3D/WebGL
          </Button>
        </motion.div>
        
        {/* Projects grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={fadeIn('up', 0.1 * index)}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-12"
          variants={fadeIn('up', 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Button
            variant="outline"
            className="px-8 py-3 bg-white/5 dark:bg-dark/20 text-primary font-medium rounded-lg border-2 border-primary hover:bg-primary hover:text-white transition"
          >
            View All Projects <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
