



export default function Alert({ 
    type = 'info', 
    message, 
    className = '' 
  }) {
    if (!message) return null
    
    const styles = {
      success: 'bg-green-900/30 text-green-200 border-green-800/50',
      error: 'bg-red-900/30 text-red-200 border-red-800/50',
      warning: 'bg-yellow-900/30 text-yellow-200 border-yellow-800/50',
      info: 'bg-blue-900/30 text-blue-200 border-blue-800/50'
    }
    
    return (
      <div className={`
        p-3 rounded-lg border text-sm
        ${styles[type]}
        ${className}
      `}>
        {message}
      </div>
    )
  }