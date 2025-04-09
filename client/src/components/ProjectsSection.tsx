import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/lib/animations';
import { PROJECTS } from '@/lib/constants';
import { ProjectFilter } from '@/lib/types';
import SectionHeading from './ui/section-heading';
import ProjectCard from './ui/project-card';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

const ProjectsSection = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('all');
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [filteredProjects, setFilteredProjects] = useState(PROJECTS.slice(0, visibleProjects));
  
  useEffect(() => {
    // Apply filter and limit to visible count
    const filtered = activeFilter === 'all' 
      ? PROJECTS 
      : PROJECTS.filter(project => project.category === activeFilter);
    
    setFilteredProjects(filtered.slice(0, visibleProjects));
  }, [activeFilter, visibleProjects]);

  const handleFilterClick = (filter: ProjectFilter) => {
    // Reset visible count when changing filter
    setVisibleProjects(6);
    setActiveFilter(filter);
  };
  
  const loadMoreProjects = () => {
    setVisibleProjects(prev => prev + 6);
  };
  
  const totalFilteredCount = activeFilter === 'all' 
    ? PROJECTS.length 
    : PROJECTS.filter(project => project.category === activeFilter).length;
  
  const hasMoreProjects = filteredProjects.length < totalFilteredCount;

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
          {[
            { id: 'all', label: 'All' },
            { id: 'web', label: 'Web Apps' },
            { id: 'mobile', label: 'Mobile' },
            { id: 'ui', label: 'UI/UX' },
            { id: '3d', label: '3D/WebGL' }
          ].map(filter => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id as ProjectFilter ? 'default' : 'outline'}
              onClick={() => handleFilterClick(filter.id as ProjectFilter)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeFilter === filter.id as ProjectFilter
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white/5 dark:bg-dark/20 hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </motion.div>
        
        {/* Projects grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={fadeIn('up', 0.1 * Math.min(index, 5))}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProjects.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-muted-foreground text-lg">No projects found in this category.</p>
          </motion.div>
        )}
        
        <motion.div 
          className="text-center mt-12"
          variants={fadeIn('up', 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {hasMoreProjects ? (
            <Button
              variant="outline"
              className="px-8 py-3 text-primary font-medium rounded-lg border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-md"
              onClick={loadMoreProjects}
            >
              Load More Projects <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="outline"
              className="px-8 py-3 text-primary font-medium rounded-lg border-2 border-primary hover:bg-primary hover:text-white transition-all shadow-md"
              onClick={() => setActiveFilter('all')}
              disabled={activeFilter === 'all' && filteredProjects.length === PROJECTS.length}
            >
              {activeFilter === 'all' && filteredProjects.length === PROJECTS.length 
                ? 'All Projects Loaded' 
                : 'View All Projects'} 
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
