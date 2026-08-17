import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionTo,
  className = '',
  style = {},
}) {
  return (
    <div
      className={`empty-state ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--sp-12) var(--sp-6)',
        background: 'var(--bg-surface)',
        border: '1px dashed var(--border-default)',
        borderRadius: 'var(--r-xl)',
        ...style,
      }}
    >
      {Icon && (
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--sg-green-light)',
            color: 'var(--sg-green-active)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--sp-4)',
          }}
        >
          <Icon size={26} strokeWidth={2} />
        </div>
      )}

      <h3
        style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          marginBottom: 'var(--sp-2)',
          color: 'var(--text-primary)',
        }}
      >
        {title}
      </h3>

      {description && (
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            maxWidth: 420,
            marginBottom: actionLabel ? 'var(--sp-5)' : 0,
            lineHeight: 1.55,
          }}
        >
          {description}
        </p>
      )}

      {actionLabel && (
        actionTo ? (
          <a href={actionTo} className="btn btn-primary btn-md">
            {actionLabel}
          </a>
        ) : (
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
