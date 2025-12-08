



export default function Badge({ 
    children, 
    variant = 'default',
    className = '' 
  }) {
    const variants = {
      default: 'bg-neutral-800 text-neutral-300',
      success: 'bg-green-900/30 text-green-200',
      error: 'bg-red-900/30 text-red-200',
      warning: 'bg-yellow-900/30 text-yellow-200',
      info: 'bg-blue-900/30 text-blue-200',
      active: 'bg-green-600 text-white',
      inactive: 'bg-neutral-700 text-neutral-400'
    }
    
    return (
      <span className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variants[variant]}
        ${className}
      `}>
        {children}
      </span>
    )
  }