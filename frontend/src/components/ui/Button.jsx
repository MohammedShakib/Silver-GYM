export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
  loading = false,
  disabled = false,
  style = {},
  ...props 
}) {
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const widthClass = fullWidth ? 'btn-full' : '';
  
  return (
    <button 
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()} 
      disabled={disabled || loading}
      style={style}
      {...props}
    >
      {loading ? (
        <span className="anim-spin" style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }} />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} strokeWidth={2} />
      ) : null}
      {children && <span>{children}</span>}
      {IconRight && !loading && (
        <IconRight size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} strokeWidth={2} />
      )}
    </button>
  );
}

