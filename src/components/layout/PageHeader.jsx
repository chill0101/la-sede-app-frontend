// Componente reutilizable para el header de las páginas



export default function PageHeader({ 
    title, 
    subtitle,
    children,
    className = '' 
  }) {
    return (
      <div className={`mb-6 ${className}`}>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-neutral-400">{subtitle}</p>
        )}
        {children && (
          <div className="mt-4">{children}</div>
        )}
      </div>
    )
  }