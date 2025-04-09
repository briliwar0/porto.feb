import { motion } from 'framer-motion';
import { useState } from 'react';
import { cardHover } from '@/lib/animations';
import { Project } from '@/lib/types';
import { ExternalLinkIcon, GithubIcon, InfoIcon } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { title, description, image, technologies, demoUrl, codeUrl } = project;
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <motion.div 
      className="rounded-xl overflow-hidden shadow-xl bg-white/5 dark:bg-dark/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      data-category={project.category}
    >
      <div className="relative overflow-hidden group h-60">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        )}
        <img 
          src={image} 
          alt={title} 
          className={`w-full h-full object-cover transform group-hover:scale-110 transition duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-6">
          <div className="flex gap-4">
            <motion.a 
              href={demoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-primary transition-all duration-300"
              aria-label={`View live demo of ${title}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ExternalLinkIcon className="h-5 w-5 text-white" />
            </motion.a>
            <motion.a 
              href={codeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-primary transition-all duration-300"
              aria-label={`View code for ${title} on GitHub`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <GithubIcon className="h-5 w-5 text-white" />
            </motion.a>
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-primary/90 text-white text-xs px-3 py-1 rounded-full shadow-md">
            {project.category === 'web' ? 'Web App' :
             project.category === 'mobile' ? 'Mobile App' :
             project.category === 'ui' ? 'UI/UX' : '3D App'}
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium transition-all duration-300 hover:bg-primary hover:text-white"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
