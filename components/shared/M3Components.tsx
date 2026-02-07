
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const M3Button = ({ 
  children, 
  onClick, 
  variant = 'filled', 
  className = '', 
  disabled = false,
  icon: Icon,
  fullWidth = false
}: any) => {
  const base = "relative flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-sm transition-all duration-300 overflow-hidden disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group";
  
  const variants: any = {
    filled: "bg-[#4f46e5] text-white elevation-1 hover:elevation-2",
    tonal: "bg-[#e0e7ff] text-[#1e1b4b]",
    outlined: "bg-transparent border border-[#777680] text-[#4f46e5] hover:bg-[#4f46e508]",
    text: "bg-transparent text-[#4f46e5] hover:bg-[#4f46e508]"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {/* State Layer Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-20 bg-current transition-opacity pointer-events-none" />
      
      {Icon && <Icon size={18} strokeWidth={2.5} className="relative z-10" />}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export const M3Card = ({ children, variant = 'elevated', className = '', onClick, ...props }: any) => {
  const variants: any = {
    elevated: "elevation-1 bg-white hover:elevation-2 transition-shadow duration-300",
    filled: "bg-[#f3edf7] border-none",
    outlined: "border border-[#c7c6d0] bg-transparent"
  };

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component 
      layout
      onClick={onClick}
      className={`rounded-[1.75rem] p-6 text-left ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export const M3TextField = ({ label, value, onChange, placeholder, type = "text", multiline = false }: any) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const InputTag = multiline ? 'textarea' : 'input';

  return (
    <div className="relative w-full">
      <div className={`
        relative flex flex-col bg-[#e1e2ec80] rounded-t-xl border-b transition-all duration-200
        ${isFocused ? 'border-[#4f46e5] bg-[#e1e2ec]' : 'border-[#44474e]'}
        px-4 pt-6 pb-2
      `}>
        <label className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${isFocused || value ? 'top-1.5 text-[11px] text-[#4f46e5] font-bold uppercase tracking-wider' : 'top-5 text-base text-[#44474e]'}
        `}>
          {label}
        </label>
        <InputTag
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ''}
          className="bg-transparent w-full text-base text-[#1b1b1f] py-1 placeholder:text-[#44474e60] focus:outline-none min-h-[24px]"
        />
        {/* Animated active indicator line */}
        <motion.div 
          initial={false}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4f46e5] origin-center"
        />
      </div>
    </div>
  );
};

export const M3Switch = ({ active, onClick, leftLabel, rightLabel }: any) => {
    return (
        <div className="flex bg-[#e1e2ec60] p-1.5 rounded-full border border-[#c7c6d040]">
            {[leftLabel, rightLabel].map((label, idx) => {
                const isActive = (idx === 0 && !active) || (idx === 1 && active);
                return (
                    <button
                        key={label}
                        onClick={() => onClick(idx === 1)}
                        className={`
                            relative px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all duration-500
                            ${isActive ? 'text-white' : 'text-[#585e71] hover:bg-[#c7c6d040]'}
                        `}
                    >
                        {isActive && (
                            <motion.div 
                                layoutId="switch-bg"
                                className="absolute inset-0 bg-[#4f46e5] rounded-full elevation-1"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{label}</span>
                    </button>
                )
            })}
        </div>
    )
}
