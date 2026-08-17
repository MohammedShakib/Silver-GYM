export default function Badge({ 
  children, 
  variant = 'neutral',
  icon: Icon,
  className = '',
  style = {},
  ...props
}) {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()} style={style} {...props}>
      {Icon && <Icon size={12} strokeWidth={2.4} />}
      <span>{children}</span>
    </span>
  );
}

