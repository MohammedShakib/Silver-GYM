export default function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--r-md)',
  className = '',
  style = {},
}) {
  return (
    <div
      className={`skeleton ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
}

export function GymCardSkeleton() {
  return (
    <div className="card" style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      <Skeleton height="180px" borderRadius="var(--r-lg)" />
      <Skeleton width="60%" height="22px" />
      <Skeleton width="40%" height="16px" />
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <Skeleton width="50px" height="20px" borderRadius="var(--r-sm)" />
        <Skeleton width="50px" height="20px" borderRadius="var(--r-sm)" />
        <Skeleton width="50px" height="20px" borderRadius="var(--r-sm)" />
      </div>
    </div>
  );
}
