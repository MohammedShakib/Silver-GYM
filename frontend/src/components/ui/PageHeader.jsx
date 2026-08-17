export default function PageHeader({
  title,
  subtitle,
  badge,
  children,
  className = '',
  style = {},
}) {
  return (
    <div
      className={`page-header ${className}`.trim()}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 'var(--sp-4)',
        marginBottom: 'var(--sp-8)',
        ...style,
      }}
    >
      <div style={{ minWidth: 260 }}>
        {badge ? <div style={{ marginBottom: 'var(--sp-2)' }}>{badge}</div> : null}
        <h1
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: 'var(--sp-1)',
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            style={{
              margin: 0,
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-md)',
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {children ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
