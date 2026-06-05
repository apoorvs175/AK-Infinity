import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 focus:outline-none'
  
  const variants = {
    primary: 'bg-gradient-to-r from-gold-primary to-gold-deep text-bg-primary hover:from-gold-hover hover:to-gold-primary hover:shadow-[0_0_30px_rgba(244,197,66,0.4)] hover:scale-105 active:scale-[0.98]',
    secondary: 'bg-bg-card border border-border-primary text-text-primary hover:border-gold-primary hover:text-gold-primary hover:bg-bg-secondary',
    outline: 'border-2 border-border-primary text-text-secondary hover:border-gold-primary hover:text-gold-primary hover:bg-bg-secondary',
  }
  
  const sizes = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-7 py-3',
    lg: 'px-10 py-4 text-lg',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
