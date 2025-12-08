



export default function Input({
    label,
    error,
    id,
    type = 'text',
    className = '',
    ...props
  }) {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-neutral-300 mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={`
            w-full px-3 py-2 bg-neutral-700/50 border rounded-md
            text-white placeholder-neutral-400
            focus:ring-2 focus:ring-red-500 focus:border-transparent
            ${error ? 'border-red-500' : 'border-neutral-700'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    )
  }