import { motion } from 'framer-motion';
import { cardHover } from '@/lib/animations';
import { Project } from '@/lib/types';
import { ExternalLinkIcon, GithubIcon } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { title, description, image, technologies, demoUrl, codeUrl } = project;
  
  return (
    <motion.div 
      className="rounded-xl overflow-hidden shadow-xl bg-white/5 dark:bg-dark/20 backdrop-blur-sm"
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      data-category={project.category}
    >
      <div className="relative overflow-hidden group h-60">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-center p-6">
          <div className="flex gap-3">
            <a 
              href={demoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-primary transition"
              aria-label={`View live demo of ${title}`}
            >
              <ExternalLinkIcon className="h-4 w-4 text-white" />
            </a>
            <a 
              href={codeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-primary transition"
              aria-label={`View code for ${title} on GitHub`}
            >
              <GithubIcon className="h-4 w-4 text-white" />
            </a>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
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
