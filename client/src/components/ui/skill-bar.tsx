import { motion } from 'framer-motion';
import { progressAnimation } from '@/lib/animations';
import { Skill } from '@/lib/types';

interface SkillBarProps {
  skill: Skill;
  animate: boolean;
}

const SkillBar = ({ skill, animate }: SkillBarProps) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium">{skill.name}</span>
        <span>{skill.percentage}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          variants={progressAnimation(skill.percentage)}
          initial="hidden"
          animate={animate ? "show" : "hidden"}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default SkillBar;
