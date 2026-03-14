import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'ghost' | 'fab';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'filled',
  size = 'md',
  icon,
  loading,
  ...props
}) => {
  const variants = {
    filled: "bg-m3-primary text-m3-on-primary hover:shadow-m3-1 active:scale-95",
    tonal: "bg-m3-secondary-container text-m3-on-secondary-container hover:shadow-m3-1 active:scale-95",
    outlined: "border border-m3-outline text-m3-primary hover:bg-m3-primary/5 active:scale-95",
    ghost: "text-m3-primary hover:bg-m3-primary/5 active:scale-95",
    fab: "bg-m3-primary-container text-m3-on-primary-container p-4 rounded-[1.125rem] shadow-m3-3 hover:shadow-m3-2 active:scale-95"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-5 py-2 text-xs",
    lg: "px-8 py-4 text-sm"
  };

  const baseStyles = "rounded-full font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};
