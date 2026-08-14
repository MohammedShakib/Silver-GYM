export default function Card({ 
  children, 
  className = '', 
  hoverable = false,
  onClick
}) {
  const hoverClass = hoverable || onClick ? 'card-hover' : '';
  const interactiveProps = onClick ? { onClick, role: 'button', tabIndex: 0 } : {};

  return (
    <div 
      className={`card ${hoverClass} ${className}`.trim()} 
      {...interactiveProps}
    >
      {children}
    </div>
  );
}
