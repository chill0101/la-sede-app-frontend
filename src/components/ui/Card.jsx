



export default function Card({ 
    children, 
    className = '',
    padding = 'md'
  }) {
    const paddings = {
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6'
    }
    
    return (
      <div className={`
        rounded-2xl border border-neutral-800 bg-neutral-900
        shadow-sm hover:bg-neutral-800 transition
        ${paddings[padding]}
        ${className}
      `}>
        {children} 
      </div>
    )
  }