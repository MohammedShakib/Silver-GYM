export default function PageHeader({
  title,
  subtitle,
  badge,
  children,
  className = '',
  style = {},
}) {
  return (
    <div className={`page-header flex flex-between flex-wrap items-center ${className}`.trim()} style={{ gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)', ...style }}>
      <div style={{ minWidth: 260 }}>
        {badge && <div className="mb-2">{badge}</div>}
        <h1 className="mb-1">{title}</h1>
        {subtitle && <p className="text-md">{subtitle}</p>}
      </div>

      {children && (
        <div className="flex items-center flex-wrap flex-gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
