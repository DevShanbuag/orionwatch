import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <motion.div
    whileHover={{ 
      y: -4, 
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
    }}
    className={`glassmorphism rounded-xl p-6 ${className}`}
    style={{
      transition: 'box-shadow 0.3s ease',
      transformStyle: 'preserve-3d'
    }}
    onMouseMove={(e) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(139, 92, 246, 0.12) 0%, transparent 50%), var(--bg-card)`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'var(--bg-card)';
    }}
  >
    {children}
  </motion.div>
);
