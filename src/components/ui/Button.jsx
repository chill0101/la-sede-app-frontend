



export default function Button({ 
    children, 
    variant = 'primary', 
    size = 'md',
    type = 'button',
    disabled = false,
    onClick,
    className = '',
    ...props 
  }) {
    const baseStyles = `font-medium rounded-md transition-colors focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 
                        disabled:opacity-50 disabled:cursor-not-allowed`
    
    const variants = {
      primary:      `bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`,
      secondary:    `bg-neutral-800 text-neutral-300 
                    hover:text-white hover:bg-neutral-700 
                    focus:ring-neutral-500`,
      outline:      `border border-neutral-700 text-neutral-300 
                    hover:bg-neutral-800 
                    focus:ring-neutral-500`,
      danger:       'bg-red-700 text-white hover:bg-red-800 focus:ring-red-500'
    }
    
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base'
    }
    
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }