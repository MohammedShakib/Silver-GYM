export default function PageContainer({
  children,
  className = '',
  maxWidth = 'var(--content-max)',
  style = {},
  ...props
}) {
  return (
    <div
      className={`container anim-fade ${className}`.trim()}
      style={{
        maxWidth,
        paddingTop: 'var(--sp-8)',
        paddingBottom: 'var(--sp-16)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
