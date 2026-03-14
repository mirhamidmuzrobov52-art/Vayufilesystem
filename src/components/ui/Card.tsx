import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  variant?: 'filled' | 'elevated' | 'outlined' | 'glass';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'filled',
  hoverable = true,
  ...props
}) => {
  const variants = {
    filled: "bg-m3-surface-container-high",
    elevated: "bg-m3-surface-container shadow-m3-1 hover:shadow-m3-2",
    outlined: "bg-m3-surface border border-m3-outline-variant/50 hover:bg-m3-surface-container-low",
    glass: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"
  };

  const baseStyles = "rounded-[2rem] p-6 transition-all duration-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hoverable ? { y: -4, scale: 1.01 } : undefined}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
