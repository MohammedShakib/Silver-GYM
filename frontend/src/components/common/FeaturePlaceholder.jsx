import { Link } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'

export default function FeaturePlaceholder({
  title,
  description,
  backTo,
  backLabel,
}) {
  return (
    <div
      className="anim-fade"
      style={{
        minHeight: 'calc(100vh - var(--header-h))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--sp-8)',
      }}
    >
      <div
        className="card card-shadow"
        style={{
          width: '100%',
          maxWidth: 720,
          padding: 'var(--sp-8)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--sg-green-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--sp-5)',
          }}
        >
          <Construction size={30} color="var(--sg-green-active)" />
        </div>

        <h1 style={{ marginBottom: 'var(--sp-3)' }}>{title}</h1>
        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: 520,
            margin: '0 auto var(--sp-6)',
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--sp-3)',
            flexWrap: 'wrap',
          }}
        >
          <Link to={backTo} className="btn btn-dark">
            <ArrowLeft size={16} /> {backLabel}
          </Link>
          <Link to="/" className="btn btn-secondary">
            Back to Site
          </Link>
        </div>
      </div>
    </div>
  )
}
