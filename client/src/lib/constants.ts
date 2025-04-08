import { Project, Skill, TimelineItem, SocialLink } from './types';

// Social links constants
export const SOCIAL_LINKS: SocialLink[] = [
  { 
    platform: 'GitHub', 
    url: 'https://github.com/johndeveloper', 
    icon: 'github' 
  },
  { 
    platform: 'LinkedIn', 
    url: 'https://linkedin.com/in/johndeveloper', 
    icon: 'linkedin' 
  },
  { 
    platform: 'Twitter', 
    url: 'https://twitter.com/johndeveloper', 
    icon: 'twitter' 
  },
  { 
    platform: 'Dribbble', 
    url: 'https://dribbble.com/johndeveloper', 
    icon: 'dribbble' 
  }
];

// Projects data
export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce solution with real-time inventory, payment processing, and admin dashboard.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
    category: 'web',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    demoUrl: 'https://ecommerce-demo.johndeveloper.com',
    codeUrl: 'https://github.com/johndeveloper/ecommerce-platform'
  },
  {
    id: 2,
    title: 'Fitness Tracking App',
    description: 'Mobile app for tracking workouts, nutrition, and progress with social features and customizable goals.',
    image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1010&q=80',
    category: 'mobile',
    technologies: ['React Native', 'Firebase', 'Redux', 'Charts'],
    demoUrl: 'https://fitness-app.johndeveloper.com',
    codeUrl: 'https://github.com/johndeveloper/fitness-app'
  },
  {
    id: 3,
    title: 'Banking Dashboard UI',
    description: 'Comprehensive banking interface with modern design, data visualization, and accessibility features.',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'ui',
    technologies: ['Figma', 'CSS', 'Accessibility', 'D3.js'],
    demoUrl: 'https://banking-ui.johndeveloper.com',
    codeUrl: 'https://github.com/johndeveloper/banking-dashboard'
  },
  {
    id: 4,
    title: '3D Product Configurator',
    description: 'Interactive 3D product customization tool with real-time rendering and configuration options.',
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: '3d',
    technologies: ['Three.js', 'WebGL', 'React', 'JavaScript'],
    demoUrl: 'https://3d-configurator.johndeveloper.com',
    codeUrl: 'https://github.com/johndeveloper/3d-configurator'
  },
  {
    id: 5,
    title: 'Project Management Tool',
    description: 'Team collaboration platform with task tracking, file sharing, and communication features.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'web',
    technologies: ['Vue.js', 'Node.js', 'PostgreSQL', 'Socket.io'],
    demoUrl: 'https://project-manager.johndeveloper.com',
    codeUrl: 'https://github.com/johndeveloper/project-manager'
  },
  {
    id: 6,
    title: 'Travel Companion App',
    description: 'Location-based travel guide with offline maps, recommendations, and trip planning features.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'mobile',
    technologies: ['Flutter', 'Firebase', 'Maps API', 'Dart'],
    demoUrl: 'https://travel-app.johndeveloper.com',
    codeUrl: 'https://github.com/johndeveloper/travel-companion'
  }
];

// Frontend skills
export const FRONTEND_SKILLS: Skill[] = [
  { name: 'React', percentage: 95 },
  { name: 'JavaScript/TypeScript', percentage: 90 },
  { name: 'HTML5/CSS3', percentage: 98 },
  { name: 'Tailwind/SASS', percentage: 92 },
  { name: 'Three.js/WebGL', percentage: 80 }
];

// Backend skills
export const BACKEND_SKILLS: Skill[] = [
  { name: 'Node.js', percentage: 92 },
  { name: 'Express/Next.js', percentage: 88 },
  { name: 'MongoDB/PostgreSQL', percentage: 85 },
  { name: 'GraphQL', percentage: 78 },
  { name: 'AWS/Firebase', percentage: 82 }
];

// Other skills (for circular display)
export const OTHER_SKILLS = [
  { name: 'Docker', icon: 'docker' },
  { name: 'Git/GitHub', icon: 'git-alt' },
  { name: 'Responsive Design', icon: 'mobile-alt' },
  { name: 'Accessibility', icon: 'universal-access' },
  { name: 'UI/UX Design', icon: 'palette' }
];

// Timeline/journey data
export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: 1,
    title: 'Senior Full-Stack Developer',
    organization: '@ Tech Innovations Inc.',
    period: '2021 - Present',
    description: 'Led a team of 5 developers to build and maintain a SaaS platform serving over 100,000 users. Implemented new features that increased user engagement by 35%.'
  },
  {
    id: 2,
    title: 'Full-Stack Developer',
    organization: '@ WebSolutions Co.',
    period: '2018 - 2021',
    description: 'Developed and optimized web applications for enterprise clients. Reduced load times by 45% through performance optimizations and modern coding practices.'
  },
  {
    id: 3,
    title: 'Front-End Developer',
    organization: '@ Creative Agency',
    period: '2016 - 2018',
    description: 'Created responsive websites and interactive experiences for clients in various industries. Specialized in animations and micro-interactions.'
  },
  {
    id: 4,
    title: 'Computer Science Degree',
    organization: '@ Tech University',
    period: '2012 - 2016',
    description: 'Bachelor\'s degree in Computer Science with focus on web technologies and user interface design. Graduated with honors.'
  }
];

// Personal info
export const PERSONAL_INFO = {
  name: 'John Developer',
  title: 'Full Stack Developer & UI/UX Enthusiast',
  location: 'New York, USA',
  email: 'john@developer.com',
  phone: '+1 (555) 123-4567'
};

// Typing effect phrases
export const TYPING_PHRASES = [
  'Full Stack Developer',
  'UI/UX Enthusiast',
  '3D Web Designer',
  'Problem Solver'
];
