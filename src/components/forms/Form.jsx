



export default function Form({ 
    children, 
    onSubmit, 
    className = '',
    maxWidth = 'max-w-md'
  }) {
    return (
      <form 
        onSubmit={onSubmit}
        className={`grid gap-4 ${maxWidth} ${className}`}
      >
        {children}
      </form>
    )
  }