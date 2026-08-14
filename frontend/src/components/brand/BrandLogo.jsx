import logoFull from '../../assets/brand/silver-gym-logo.png'
import logoIcon from '../../assets/brand/silver-gym-icon.png'
import logoWordmark from '../../assets/brand/silver-gym-wordmark.png'

const logoSources = {
  full: logoFull,
  icon: logoIcon,
  wordmark: logoWordmark,
}

export default function BrandLogo({
  variant = 'full',
  className = '',
  dark = false,
  size = 'md',
  showTagline = false,
}) {
  const src = logoSources[variant] || logoSources.full
  const classes = ['brand-logo', `brand-logo-${variant}`, `brand-logo-${size}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} data-dark={dark}>
      <img src={src} alt="Silver GYM" />
      {showTagline && <span className="brand-logo-tagline">Dhaka Network</span>}
    </span>
  )
}
