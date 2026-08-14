export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  fullWidth = false,
  ...props 
}) {
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button 
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()} 
      {...props}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
}
