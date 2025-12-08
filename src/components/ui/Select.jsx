export default function Select({
  label,
  error,
  id,
  options = [],
  className = '',
  ...props
}) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-300 mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
            w-full px-3 py-2 bg-neutral-700/50 border rounded-md
            text-white
            focus:ring-2 focus:ring-red-500 focus:border-transparent
            ${error ? 'border-red-500' : 'border-neutral-700'}
            ${className}
          `}
        {...props}
      >
        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className={`bg-neutral-800 ${option.disabled ? 'text-neutral-500' : ''}`}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}