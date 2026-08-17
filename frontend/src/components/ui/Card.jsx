export default function Card({ 
  children, 
  className = '', 
  hoverable = false,
  shadow = false,
  dark = false,
  selected = false,
  feature = false,
  style = {},
  onClick,
  ...props
}) {
  const hoverClass = hoverable || onClick ? 'card-hover' : '';
  const shadowClass = shadow ? 'card-shadow' : '';
  const darkClass = dark ? 'card-dark' : '';
  const selectedClass = selected ? 'card-selected' : '';
  const featureClass = feature ? 'card-feature' : '';
  const interactiveProps = onClick ? { onClick, role: 'button', tabIndex: 0 } : {};

  return (
    <div 
      className={`card ${hoverClass} ${shadowClass} ${darkClass} ${selectedClass} ${featureClass} ${className}`.trim()} 
      style={style}
      {...interactiveProps}
      {...props}
    >
      {children}
    </div>
  );
}

